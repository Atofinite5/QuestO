# Skidora (append to AGENTS.md — do not replace existing counsel)

This project follows the Skidora operating system.

- Surgical (default ~90%): 7-Rung Ladder. Shortest working diff. ≤3 lines. Zero paperwork. One silent line in `.skidora/recover.md`.
- Blueprint (~10%): public routes, schema migrations, or `/plan` only. Pass A `file:line` + Pass B real command (or `UNVERIFIED — <reason>`).
- Two valid designs: ask one P0, then wait. Do not implement both.
- No invented routes. Authenticated routes: 401 on bad auth, then 200 on valid.
- Memory: only `.skidora/recover.md` (<40 lines). Never `plan.md`, `draft.md`, or `graph.md`.
- Proof-of-work: 3-line badge after structural work. Never fake exit 0 or 200.
- Traces: follow `evals/traces.md` and `examples.md`. Violating a trace fails the turn.
- Erlang/Elixir: load `skidora-erlang-elixir` only when `mix.exs` or `rebar.config` exists.
