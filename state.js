import { readFileSync, writeFileSync } from "fs";

const STATE_PATH = new URL("./state.json", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");

const EMPTY_STATE = {
  sankalp_start: "2026-05-12",
  days: {},
  active_ladders: [],
  events: [],
  last_telegram_update_id: 0,
  config: {},
};

export function loadState() {
  try {
    const raw = readFileSync(STATE_PATH, "utf8");
    return { ...EMPTY_STATE, ...JSON.parse(raw) };
  } catch {
    return { ...EMPTY_STATE };
  }
}

export function saveState(state) {
  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + "\n", "utf8");
}
