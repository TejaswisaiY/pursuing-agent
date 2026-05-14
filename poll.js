import "dotenv/config";
import { loadState, saveState } from "./state.js";
import { seedConfig } from "./seed.js";
import { processInbound } from "./telegram.js";

async function poll() {
  const now = new Date().toISOString();

  let state = loadState();

  state = seedConfig(state);
  state = await processInbound(state);

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
