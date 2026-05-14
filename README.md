# pursuing-agent

Personal accountability system that runs as a polling script on GitHub Actions.

Every 5 minutes it wakes, evaluates state, sends Telegram messages, and escalates when ignored.

**Not a long-running server.** Each run is stateless; all persistence is in `state.json`, which is committed back to the repo by the Actions workflow after each poll.

## How it works

```
GitHub Actions (every 5 min)
  └── node poll.js
        ├── load state.json
        ├── fetch Telegram updates (built-in fetch, no library)
        ├── evaluate today's check-in status
        ├── send messages / escalate if ignored
        └── commit updated state.json back to repo
```

## Local setup

```bash
cp .env.example .env
# fill in your TELEGRAM_BOT_TOKEN, GEMINI_API_KEY, USER_CHAT_ID

npm install
node seed.js   # seed config into state.json (only needed once)
node poll.js   # run a single poll cycle
```

## Environment variables

| Variable | Description |
|---|---|
| `TELEGRAM_BOT_TOKEN` | From @BotFather |
| `GEMINI_API_KEY` | Google AI Studio |
| `USER_CHAT_ID` | Your Telegram numeric chat ID |

These are set as **GitHub Actions secrets** — never committed to the repo.

## State shape

```json
{
  "sankalp_start": "2026-05-12",
  "days": {},
  "active_ladders": [],
  "events": [],
  "last_telegram_update_id": 0,
  "config": {}
}
```

- `days` — keyed by ISO date, holds check-in status per day
- `active_ladders` — escalation ladder state (timeouts, snoozes)
- `events` — audit log of messages sent / received
- `last_telegram_update_id` — offset for Telegram long-polling deduplication
- `config` — seeded defaults (goals, timings, reason seeds)
