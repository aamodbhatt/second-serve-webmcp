# Validation record — September 3, 2026 IST

- `npm test`: 12 passing tests.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- Real in-app browser WebMCP discovery: all six tools registered with expected schemas and annotations.
- `get_workspace`: returned visible donor/kitchen state; unknown fields rejected.
- `preview_plan`: hypothetical Open Table capacity of 30 returned 410 portions without mutation; invalid objective rejected.
- `stage_plan`: returned a 480-portion pending proposal, shown in the UI; stale revision rejected without mutation.
- Human approval control: enabled for the proposal, produced an approved manifest of 480 portions.
- Human protect control: marked The Green Kitchen → Hope Community as protected at exactly 120 portions.
- `update_kitchen_capacities`: changed Open Table to 30 and returned “Open Table exceeds capacity”; negative capacity rejected without mutation.
- Replan through `stage_plan`: 410 portions; the 120 protected portions unchanged; 70 unassigned with reason.
- Human approval of revised plan: `export_approved_manifest` returned 410 approved portions, no conflicts.
- `export_approved_manifest` before any human approval: intentional error.
- `explain_match`: d1/k4 rejected because of sesame; unknown donor rejected.
- Read-back confirmed shared state and human/agent audit attribution.
- A discovered SVG title hydration mismatch was fixed by using single-string title children; fresh load rendered cleanly and re-registered tools.
- Demo MP4: 142.63 seconds, 1280×720 H.264 video, AAC audio. Created from actual captured app states with synthetic narration. Separate SRT captions supplied.

## Practical limits

The capture tool produced reduced-resolution page content; the narrated video uses cropped real screenshots rather than continuous screen recording. For a stronger entry, the supplied script can be used to record a continuous high-resolution browser-agent walkthrough.

The final production artifact is a static export: only public HTML, JavaScript, CSS, and images are deployed. Server runtime bundles are excluded. The build scaffold still reports development/transitive dependency advisories; update those before extending the project into a server-backed app. This is a planning prototype, not an operational dispatch system.
