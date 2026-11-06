# Domain Docs

How engineering skills should consume this repo's domain documentation.

## Before exploring, read these

- **`GLOSSARY.md`** at the repo root, or
- **`GLOSSARY-MAP.md`** at the repo root if one exists; read the glossary relevant to the topic.
- The relevant feature description and requirements in **`docs/features/`**.
- The relevant cross-cutting system description and requirements in **`docs/system/`**.
- Relevant decisions in **`docs/adr/`**.

If these files don't exist, proceed without flagging their absence. Create them only when domain terms or decisions have actually been resolved.

## File structure

This is a single-context repo:

```
/
├── GLOSSARY.md
├── docs/
│   ├── adr/
│   ├── agents/
│   ├── features/
│   └── system/
└── src/
```

Feature and system docs are durable domain references. Track proposed changes and implementation tickets in GitHub Issues.

## Use the glossary's vocabulary

Use domain terms as defined in `GLOSSARY.md`. If a term is missing, reconsider whether it belongs in the project's vocabulary or note the gap for domain modeling.

## Flag ADR conflicts

If a proposal contradicts an existing ADR, surface the conflict rather than silently overriding it.
