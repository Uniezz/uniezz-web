# Landing story

Last edited: 2026-11-03

## Purpose

Explain uniezz as a shared space for students in Lublin. Show what students can do before asking them to join. Keep the language simple in English, Polish, Ukrainian, and Russian.

## Sequence

1. **Opening:** a full-screen uniezz wordmark and a plain explanation of the product. Scrolling enlarges and fades the lettering, then reveals a student question and reply inside the same pinned scene.
2. **Meet cazy:** the existing black cat fills the next scene. Oversized lettering passes behind him as he moves into view. He is a companion in the interface, not a chatbot or support service.
3. **Why uniezz:** one pinned stage changes between Feed, Connections, Profile, Chat, Exams & Courses, and FAQ. Copy and feature illustrations transition together. The tab strip lets visitors skip scenes; An underline marks the current tab; no step numbers or section labels. cazy has his own scene.
4. **Lublin:** pin the real campus map while page scrolling moves its camera from Poland into Lublin. Preserve search, zoom, loading and error states. The camera holds on Poland, centers Lublin, then zooms in. Opening a cluster also advances page scroll to the matching zoom progress while preserving the cluster camera animation. Phone portrait screens use the same sequence; reduced motion and short landscape windows start in Lublin.
5. **Join:** show the university sign-in steps, then finish on a full-screen “Join uniezz” invitation. The large heading itself links to sign-in, with an inline arrow and no repeated button label. React Spring moves a soft opacity highlight across its letters from left to right; the animation pauses outside the viewport and stays static in reduced-motion mode.

## What the code supports

| Area            | Evidence                                                         | Landing treatment                                                                  |
| --------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Feed            | `useFeed.ts`, post composer and post details                     | Questions, events, posts and replies; illustrate a question and reply              |
| Connections     | `useProfiles.ts`, students directory; discovery route uses mocks | Show people meeting; do not promise working matching                               |
| Profile         | `ProfileEditor.tsx`, profile form and programme hooks            | Bio, interests, study details and visibility controls                              |
| Chat            | Chat route holds mock conversations and local messages           | Illustration; copy describes the planned feature                                   |
| Exams & Courses | Mock material rows, metadata-only uploads, empty reviews         | Illustration; copy describes the planned feature; no claim of an available archive |
| FAQ             | Empty FAQ tab                                                    | Describe a place for common questions; do not imply entries are available yet      |
| cazy            | Sidebar active-tab cat and empty-state cat                       | Existing mascot assets; no invented assistant capabilities                         |
| Campus map      | Universities API and MapLibre                                    | Keep interactive campus map separate from FAQ                                      |

## Visual and motion direction

Use the app's ink, dark glass, blue accents, rounded panels and existing typeface. No stock lifestyle photos, pale cards, bright section backgrounds, invented testimonials or usage statistics. Use large type, connecting lines and an open dark notebook and a large question mark. Do not simulate app windows, buttons or student accounts.

The opening, cazy and app tour each stay on screen while scrolling advances their scene. The effect follows native scroll position, including reverse scrolling. It does not intercept wheel or touch input. Portrait phones use compact versions of the same pinned scenes. Windows shorter than 640px and reduced-motion mode show all content in normal flow. React Spring handles scroll subscriptions; a thin section hook maps progress to scene state. A vertical yarn ball tracks overall page progress. The thread stays straight while the ball moves and rotates around its center with scrolling. Rotation stops when scrolling settles and reverses on upward scroll. Reduced motion disables rotation. The interface remains dark throughout; illustrations use the existing cat and product UI instead of lifestyle photos.

## Scope and checks

Change landing composition, landing-only illustrations and styles, all four landing translations and generated translation types. Preserve authentication routes, app screens, shared component behavior and map states. Check formatting, lint, TypeScript, translation parity, build, responsive layout, chapter navigation and reduced motion. Do not start a development server.

## Yarn asset

`public/landing/yarn-ball.png` is a transparent wool yarn ball generated with the built-in imagegen tool, resized to 192px for the scroll indicator. The source image stays outside the repository.

Generation prompt:

> Use case: product-mockup. Asset type: small decorative yarn-ball scroll indicator for a dark navy website. Create a single photorealistic round ball of soft periwinkle blue wool yarn, isolated on a truly transparent background. Three-quarter close-up studio photograph, tangible layered winding strands crossing in several directions, tiny wool fibers, rich blue-purple shadows between strands, gentle light from upper left. The ball should fill 85% of a square canvas with a small loose curling yarn end at lower left. Compact rounded silhouette, centered. It must read clearly as a real wool yarn ball at 40px display size; thick distinct strands and dimensional shading. No needles, no hands, no floor, no props, no text, no logo, no drawn outline, no icon/vector style, no background, no cast shadow outside object. Genuine transparent alpha.
