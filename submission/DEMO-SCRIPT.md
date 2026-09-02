# Second Serve — 2 minute 30 second demo

Record a public YouTube video with audible English narration, strictly under 3 minutes. Show the actual app and actual browser-agent tool interaction. Do not substitute a slide deck for the working demo. Leave 10–15 seconds of margin.

## 0:00–0:15 — Problem and workspace
Screen: fresh rescue board, 480 meals, five kitchens.
Voice: “Good food goes to waste while community kitchens need meals. The hard part is coordinating changing constraints without losing the commitments people have already made. This is Second Serve: a shared food-rescue workspace for people and their agents.”

## 0:15–0:40 — Real WebMCP
Screen: Agent tools panel, then actual browser agent call.
Prompt: “Read this rescue workspace and stage an earliest-expiry plan for review.”
Voice: “The website exposes six WebMCP tools. My browser agent reads the same offers, kitchen requirements, and current revision I see. It stages a plan directly on my board. This is a real tool call into application state, not a chat mockup.”

## 0:40–1:00 — Human decision
Screen: 480-portion proposal. Click Approve plan. Protect The Green Kitchen → Hope Community, 120 portions.
Voice: “The solver matches all 480 sample portions. It respects capacity, dietary requirements, declared allergen exclusions, and estimated time windows. I approve the plan, then protect this 120-portion commitment because I have already agreed it locally.”

## 1:00–1:35 — The key moment
Screen: Simulate capacity drop, or ask agent to update k2 to 30. Show conflict, then replan.
Prompt: “Open Table can only receive 30 portions. Update its capacity and stage a new plan. Keep every protected commitment and explain the shortfall.”
Voice: “Now Open Table calls: their fridge is full. Their capacity drops from 100 to 30. The old plan is flagged immediately. The agent proposes a new feasible plan for 410 portions. My 120 protected portions stay exactly where I put them. The remaining 70 are visible with a reason. The app does not hide the shortfall.”

## 1:35–1:55 — Explainability and control
Screen: explain_match d1/k4 response, activity trail.
Prompt: “Why can't The Green Kitchen deliver to Little Steps?”
Voice: “The agent can explain rejected matches. Here, Little Steps excludes sesame. Every change records whether it came from me or the agent. Stale tool calls fail instead of overwriting a newer human decision, and Undo makes exploration reversible.”

## 1:55–2:15 — Completion
Screen: approve revised plan, download handoff, show import-data panel briefly.
Voice: “I review the revised plan and export a handoff. Coordinators can also bring their own JSON data. No deliveries are dispatched by the demo. The built-in planner needs no API key; a compatible browser agent uses the real WebMCP surface.”

## 2:15–2:30 — Honest close
Screen: network board and product title.
Voice: “The data and travel estimates here are illustrative. The next step is a pilot with a local rescue team and real transport constraints. Second Serve shows what WebMCP makes possible: agents that work with our decisions, in the places where we make them. Every meal has a next stop.”

## Recording notes
- Use a desktop viewport so the board and tool panel are legible.
- Reset demo before recording. Do not reload during the flow: reload clears plans and commitments for fresh review.
- Show a real agent's stage_plan and update_kitchen_capacities calls; the Build rescue plan button is a deterministic UI action, not an LLM.
- Avoid unrelated tabs, notifications, and personal information in the recording.
- Verify duration is below 180 seconds, audio is audible, and YouTube visibility is Public.
