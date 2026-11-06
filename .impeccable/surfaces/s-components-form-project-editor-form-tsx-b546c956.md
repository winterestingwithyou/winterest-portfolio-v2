---
version: 1
slug: "s-components-form-project-editor-form-tsx-b546c956"
primary_target: "src/features/projects/components/form/project-editor-form.tsx"
related_targets: []
---

# Project editor image gallery

- Surface: Existing project editor form (`src/features/projects/components/form/project-editor-form.tsx`).
- Mode: Operate.
- Audience and job: Authorized editors manage project imagery while creating or updating project content.
- Action and proof: Add, remove, and reorder images, provide English and Indonesian alternative text, and save with the project.
- Constraints: Preserve the existing form structure and Flat Precision system; reuse ImageUploader for upload, Media Library selection, and external URLs; ordering must work without drag-and-drop; no maximum image count.
- Unresolved decisions: None.

## Direction contract

THESIS: Make gallery maintenance a clear part of editing a project, not a separate workflow.
OWN-WORLD: Inherit the dashboard's Flat Precision form language: grouped fields, solid surfaces, hairline borders, direct labels, and restrained orange action emphasis.
STORY: Editors add images, describe them in both supported languages, adjust their order explicitly, and save with the rest of the project.
FIRST VIEWPORT: Keep the existing Cover Image control, then show a gallery section with each image preview, localized alt-text fields, and adjacent move-up, move-down, and remove controls; place an add-image action after the list.
FORM: Extend the existing project editor image fields; no concept-seed reference applies to this narrow extension of the existing surface.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
