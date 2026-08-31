# CAISN — Campaign Photo Brief

Shot list for `CampaignSection` (`src/components/CampaignSection.tsx`) and any
future lookbook module. None of these exist yet — the homepage currently uses
a real-garment-photography fallback instead of fabricating this content. Once
shots are delivered, populate the `modelImages` prop (or extend `Product`
with a `campaignImages` field) rather than editing the component.

## Direction

- Natural, confident, slightly detached expression — not a forced influencer
  smile or a luxury-brand stare.
- Strong silhouette visibility: loose garments should read clearly against
  the background, not get lost in it.
- Relaxed stance. No forced/staged poses.
- Consistent lighting and color grading across the full set so shots can be
  freely mixed across sections.
- Two locations: one clean studio set (matches the site's warm-bone product
  backdrop), one raw urban/industrial exterior for contrast.

## Required shots

| # | Filename (suggested) | Garment | Pose / framing | Angle | Location | Aspect ratio |
|---|---|---|---|---|---|---|
| 1 | `echo-full-body-front.jpg` | ECHO ZIP HOODIE | Full body, standing, relaxed stance | Eye level | Studio | 4:5 |
| 2 | `echo-low-angle.jpg` | ECHO ZIP HOODIE | Full body | Low camera angle (outerwear should feel oversized/dominant) | Studio or urban | 4:5 |
| 3 | `echo-walking.jpg` | ECHO ZIP HOODIE | Mid-stride, natural walking frame | Eye level, slight side angle | Urban/industrial | 3:4 |
| 4 | `zipup-three-quarter.jpg` | FORMA ZIP-UP | Three-quarter turn, hands relaxed | Eye level | Studio | 4:5 |
| 5 | `jogger-walking.jpg` | FORMA JOGGER | Mid-stride, full leg visible | Eye level | Urban/industrial | 3:4 |
| 6 | `tracksuit-full-body.jpg` | FORMA TRACKSUIT (both pieces worn together) | Full body, standing | Eye level | Studio | 4:5 |
| 7 | `torso-crop-echo.jpg` | ECHO ZIP HOODIE | Cropped torso, chest appliqué visible | Eye level, close | Studio | 1:1 |
| 8 | `back-fit-zipup.jpg` | FORMA ZIP-UP | Back view, full body or three-quarter | Eye level | Studio | 4:5 |
| 9 | `seated-editorial.jpg` | Any FORMA piece | Seated, relaxed editorial pose | Eye level or slightly above | Urban/industrial | 4:5 |
| 10 | `material-closeup.jpg` | Any garment | Macro — wash texture, zipper hardware, or ribbing detail (worn, not flat-lay) | Close, natural light preferred | Studio or urban | 1:1 |

## Explicitly avoid

- Fake luxury-car or private-jet backdrops.
- Group/lifestyle "influencer" styling.
- Heavy filters or grain that obscure real garment color/texture — the site's
  product pages must stay color-accurate to what's actually sold.
- Any shot implying stock, availability or pricing information not already
  confirmed in `src/lib/commerce/data.ts`.

## Delivery format

- Export at minimum 2400px on the longest edge, sRGB, `.jpg` or `.webp`.
- Deliver both the aspect ratio listed above and, where practical, a loose
  full-frame version so crops can be adjusted without re-shooting.
