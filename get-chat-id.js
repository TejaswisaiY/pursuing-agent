import "dotenv/config";

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error("TELEGRAM_BOT_TOKEN not set in .env");
  process.exit(1);
}

const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
const json = await res.json();

if (!json.ok) {
  console.error("Telegram error:", json.description);
  process.exit(1);
}

if (json.result.length === 0) {
  console.log("No updates found. Send any message to your bot first, then re-run this script.");
  process.exit(0);
}

const seen = new Set();
for (const update of json.result) {
  const chat = update.message?.chat ?? update.edited_message?.chat;
  if (!chat || seen.has(chat.id)) continue;
  seen.add(chat.id);
  console.log(`chat_id: ${chat.id}  (${chat.username ?? chat.first_name ?? "unknown"})`);
}
