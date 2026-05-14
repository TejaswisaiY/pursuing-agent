const BASE = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;
const CHAT_ID = process.env.USER_CHAT_ID;

// ── parse ────────────────────────────────────────────────────────────────────

export function parseReply(text) {
  const t = text.trim().toLowerCase();

  if (/^(up|awake|done|👍)$/.test(t)) {
    return { type: "confirmation" };
  }

  const feedMatch = t.match(/^(?:(\d+)\s*feeds?|feed\s*(\d+))$/);
  if (feedMatch) {
    return { type: "feed_count", count: Number(feedMatch[1] ?? feedMatch[2]) };
  }

  if (t === "pause") {
    return { type: "override-pause" };
  }

  if (/^(minimum|min day)$/.test(t)) {
    return { type: "override-minimum" };
  }

  const skipMatch = t.match(/^skip\s+(.+)$/);
  if (skipMatch) {
    return { type: "override-skip", target: skipMatch[1].trim() };
  }

  return { type: "freeform", text: text.trim() };
}

// ── outbound ─────────────────────────────────────────────────────────────────

export async function sendMessage(text, state) {
  const res = await fetch(`${BASE}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: CHAT_ID, text }),
  });

  const json = await res.json();
  const ok = json.ok === true;

  if (!ok) console.error("Telegram sendMessage failed:", json.description);

  state.events.push({ type: "sent", text, ok, at: new Date().toISOString() });
  return { ok, state };
}

// ── inbound ──────────────────────────────────────────────────────────────────

export async function fetchUpdates(state) {
  const offset = (state.last_telegram_update_id ?? 0) + 1;
  const res = await fetch(`${BASE}/getUpdates?offset=${offset}&timeout=0`);
  const json = await res.json();

  if (!json.ok) {
    console.error("Telegram getUpdates failed:", json.description);
    return { updates: [], state };
  }

  const updates = json.result ?? [];

  if (updates.length > 0) {
    state.last_telegram_update_id = updates[updates.length - 1].update_id;
  }

  return { updates, state };
}

export async function processInbound(state) {
  const { updates, state: s1 } = await fetchUpdates(state);

  for (const update of updates) {
    const msg = update.message ?? update.edited_message;
    if (!msg?.text) continue;

    const parsed = parseReply(msg.text);

    s1.events.push({
      type: "inbound",
      from: msg.from?.username ?? msg.from?.id ?? "unknown",
      text: msg.text,
      parsed,
      at: new Date().toISOString(),
    });

    console.log(`inbound [${parsed.type}]: ${msg.text}`);
  }

  return s1;
}
