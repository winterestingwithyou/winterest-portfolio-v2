---
trigger: always_on
description: Consult the graphify knowledge graph at graphify-out/ for codebase and architecture questions.
---

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:

- For codebase or architecture questions, when `graphify-out/graph.json` exists, first run `graphify query "<question>"` (CLI) or `query_graph` (MCP). Use `graphify path "<A>" "<B>"` / `shortest_path` for relationships and `graphify explain "<concept>"` / `get_node` for focused concepts. These return a scoped subgraph, usually much smaller than `GRAPH_REPORT.md` or raw grep output.
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context
- Let Graphify hooks maintain code-derived graph data: post-commit rebuilds changed code files and post-checkout rebuilds after branch switches. Do not run `graphify update .` after every edit or during normal implementation.
- Run the CLI `graphify update .` manually only when a code hook is unavailable or fails. For documentation, papers, or images that should be added to the graph, use the `/graphify . --update` workflow; the Git hooks cover code files only.
