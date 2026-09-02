# Submission links
Live app: https://second-serve-rescue.therealaamod.chatgpt.site
Public source: https://github.com/aamodbhatt/second-serve-webmcp
Demo video: upload the included MP4 to public YouTube and use that URL.

# Project name
Second Serve

# Tagline
Every meal has a next stop. People and agents plan food rescue together.

# Inspiration
Food-rescue coordination is full of local knowledge: a kitchen's capacity changes, some meals contain excluded allergens, and a coordinator has already promised a delivery. A plan that ignores those commitments is unusable. We wanted the agent to work inside the coordinator's workspace, with the same constraints and decisions in view.

# What it does
Second Serve matches surplus meal offers to community kitchens. An agent can inspect the board, compare what-if plans, explain why a match is rejected, update declared capacity, and stage a proposal. A coordinator reviews that proposal, approves it, and protects commitments. When conditions change, the agent replans around those protected quantities.

The reproducible demo begins with 480 fictional portions. A kitchen's capacity drops by 70. The new plan allocates 410 portions while preserving a 120-portion commitment and explaining what remains unassigned. These are scenario outputs, not a claim of real meals rescued.

# Why WebMCP fits
The valuable context is in the browser: protected assignments, the current proposal, kitchen changes, and the coordinator's latest decision. WebMCP gives the agent structured access to that exact state and puts its proposal back into the visible workspace. Humans and agents can take turns without copying tables into chat or keeping separate plans synchronized.

# How we built it
React, TypeScript, Vinext/Vite, and Sites-compatible hosting. A deterministic min-cost maximum-flow solver handles supply, capacity, dietary compatibility, declared allergen exclusions, and estimated time windows. Two objectives compare earlier-expiring meals with shorter journeys.

Six imperative tools register through document.modelContext, with a navigator.modelContext compatibility fallback. Tool schemas and runtime validation reject invalid input. Mutations require the current workspace revision and return structured results after the visible state updates. Both UI actions and WebMCP calls use one store.

# Human–agent experience
The agent can propose and explain; the coordinator reviews and protects. Protected commitments survive replanning unchanged. If a protected commitment becomes infeasible, the app reports the conflict instead of silently moving it. A shared activity trail distinguishes browser-agent actions from coordinator controls. Undo makes exploration reversible.

# Challenges we addressed
Optimizing a new plan while retaining exact protected quantities; preventing stale agent calls from overriding newer human changes; making unmet demand visible; and returning useful errors for diet, allergen, and time conflicts. The residual graph can reroute flexible offers so constrained offers are not stranded by a greedy first choice.

# Accomplishments
A coherent app that runs without an account or API key, genuine browser-discoverable WebMCP tools, a working review-and-replan loop, portable JSON datasets, CSV handoffs, and automated tests for constraints, atomic changes, revisions, and human approval. The built-in planner is explicitly labeled; there is no simulated LLM chat.

# What we learned
The most useful agent interface includes the context of a human decision, not just CRUD operations. Read-only simulations, explicit proposals, and revision checks make it easier for people to work with agents in a changing workspace.

# What's next
Pilot with a local rescue coordinator, replace illustrative coordinates with real journey estimates, and add transport availability and operational verification. Multi-user persistence, dispatch, and food-safety workflows are future work, not implemented claims.

# Built with
WebMCP, React, TypeScript, Vinext, Vite, Tailwind CSS, shadcn, Base UI, Lucide, Cloudflare-compatible Workers, OpenAI Codex.

# Judge testing instructions
No app login or API key required once public access is enabled. Open the live URL in ChatGPT's in-app browser or compatible Chrome with WebMCP enabled. The Agent tools panel reports support. The complete demo sequence and prompts are in README.md. Use Reset demo to restore sample data. Approval and protecting commitments are visible UI actions. A reload retains validated inputs but clears plans for fresh review.

# Limitations
Fictional demo records; illustrative travel estimates; independent transport assumed; no driver routing, live dispatch, partner integration, adoption claims, or food-safety certification. Inputs stay in browser storage. Public source uses the MIT license.
