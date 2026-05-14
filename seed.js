import "dotenv/config";
import { loadState, saveState } from "./state.js";

const DEFAULT_CONFIG = {
  sankalp_name: "90-Day Discipline Sprint",
  check_in_hour_utc: 18,
  escalation_wait_minutes: 30,
  daily_goals: [
    "Deep work block (2h min)",
    "Exercise / movement",
    "No social media before 6 PM",
  ],
};

const REASON_SEEDS = [
  // TODO: fill these with real personal motivations
  "Because the gap between who you are and who you could be is closed only by discipline.",
  "Because future-you is watching.",
  "Because you made a promise.",
];

export function seedConfig(state) {
  if (Object.keys(state.config).length === 0) {
    state.config = { ...DEFAULT_CONFIG, reason_seeds: REASON_SEEDS };
    console.log("Config seeded with defaults.");
  } else {
    console.log("Config already present — skipping seed.");
  }
  return state;
}

// Run directly: node seed.js
if (process.argv[1].endsWith("seed.js")) {
  const state = loadState();
  const seeded = seedConfig(state);
  saveState(seeded);
  console.log("state.json updated.");
}
