# Feature: Projects and Case Studies

## Description

Projects lets the portfolio owner’s team manage project showcases and case studies. Visitors can browse public projects and open a detailed case study for each published project.

## Requirements

- Editors, admins, and owners can create, edit, and delete projects. Public visitors can view only projects marked both published and public.
- Project titles, summaries, categories, and descriptions are available in English and Indonesian.
- Projects can be associated with technologies, and visitors can find projects by searching or filtering by category or technology.
- A project detail page can present its overview, architecture, challenges, live demo, and source code links when those details are provided.
- Projects support draft, in-progress, published, and archived states, as well as public or private visibility.
- No more than four projects may be featured on the home page at once. Users can remove a feature designation or edit other project details when the limit is reached.
- Project slugs must be unique.

## Project imagery

- A project can have a Cover Image and any number of additional Project Gallery Images. A project may have gallery images without a Cover Image.
- The Cover Image represents the project in project listings. Listings use only the Cover Image, or the existing fallback when no Cover Image is set; gallery images are only loaded on project detail pages.
- The project detail gallery shows the Cover Image first when present, followed by additional images in the editor-defined order. The Cover Image must not appear twice in the same gallery. The same image may be reused by different projects, but not repeated within one project.
- Images embedded in a project description remain part of that description and are not added to the project detail gallery.
- Editors, admins, and owners can add, remove, and reorder gallery images using uploaded media, existing Media Library images, or external image URLs. There is no product-defined maximum image count. Ordering controls must work without drag-and-drop.
- Editors can provide alternative text for each displayed image, including the Cover Image, in English and Indonesian. Drafts may have incomplete alternative text, but every displayed image must have alternative text in both languages before publication. Until legacy Cover Images have localized alternative text, their alternative text falls back to the project title in the current language.
- If a Media Library asset is in use as a project Cover Image or gallery image, normal deletion is blocked. Explicitly confirmed cascade deletion removes all project references to that asset.
- On project detail pages, the gallery replaces the existing Cover Image display area. Images are shown whole without cropping. A single image is displayed without carousel controls; an empty gallery uses the existing fallback.
- With multiple images, visitors can navigate using previous/next controls, position indicators, or touch gestures. The carousel loops and advances automatically every five seconds. It has a visible pause/play control.
- Autoplay pauses while the pointer is over the carousel, when keyboard focus enters it, and while the browser tab is inactive. Keyboard focus and manual navigation keep it paused until the visitor explicitly resumes it. Pointer hover pauses only while hovered; tab inactivity pauses and resumes when the tab becomes active unless the visitor paused manually.
- Respect reduced-motion preferences by disabling autoplay initially. Visitors may explicitly start autoplay with the play control. Manual navigation remains available when autoplay is disabled.
