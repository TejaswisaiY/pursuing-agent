import "dotenv/config";
import { loadState, saveState } from "./state.js";
import { seedConfig } from "./seed.js";

async function poll() {
  const now = new Date().toISOString();

  let state = loadState();

  // Ensure config is always populated before any logic runs
  state = seedConfig(state);

  // TODO: fetch Telegram updates
  // TODO: evaluate today's check-in state
  // TODO: send scheduled messages / escalations
  // TODO: commit state back via GitHub API or git CLI in Actions

  console.log(`poll ran at ${now}`);

  saveState(state);
}

poll().catch((err) => {
  console.error("poll failed:", err);
  process.exit(1);
});
