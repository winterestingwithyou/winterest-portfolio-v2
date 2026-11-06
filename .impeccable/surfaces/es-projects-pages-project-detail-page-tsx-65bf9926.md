---
version: 1
slug: "es-projects-pages-project-detail-page-tsx-65bf9926"
primary_target: "src/features/projects/pages/project-detail-page.tsx"
related_targets: []
---

# Project detail image gallery

- Surface: Existing public project detail page (`src/features/projects/pages/project-detail-page.tsx`).
- Mode: Experience.
- Audience and job: Visitors evaluating Winterest's work use project imagery to understand what was built.
- Action and proof: Explore a project's ordered images without leaving its detail page; the real project images are the proof.
- Constraints: Preserve the established Cloudflare + Bun / Flat Precision system, existing copy and layout, bilingual image descriptions, reduced-motion preferences, and keyboard/touch access. The project list continues to use only its Cover Image.
- Unresolved decisions: None.

## Direction contract

THESIS: Let the project work lead; a quiet, contained gallery extends the existing detail page instead of adding decorative chrome.
OWN-WORLD: Inherit Flat Precision: solid neutral frame, hairline border, Winterest Orange only for active controls, and no cropping or broad effects.
STORY: Visitors see the Cover Image first when present, then the ordered gallery, and can inspect the work with familiar controls or touch.
FIRST VIEWPORT: Preserve the existing title, summary, and action order; replace the current cover frame with an aspect-ratio-stable gallery directly below the project hero. Show one image without controls; with multiple images, place clear navigation and position indicators on the frame and keep the pause/play action visible.
FORM: Extend the established project-detail image frame; no concept-seed reference applies to this narrow extension of the existing surface.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
