# Implementation Plan: Unified Camera Zoom-Out & Hero Typography Restoration

Restore the initial hero headline and subheader on top of the photograph, and implement a single unified camera zoom-out rig that transitions seamlessly from a tight macro view of the photo to the full aerial driftwood desk scene.

---

## 1. Hero Headline & Subheader Restoration
- **Z-Index Fix**: Move the centered `CHANTY` editorial wordmark and tagline container to `z-40` (in front of the photo and desk layers) so it is prominently visible on top of the photograph before scrolling starts.
- **Initial Load Animation**: Preserve the Cormorant Garamond letter-staggered blur-reveal animation and the understated tagline: *"Every place leaves a story."*
- **Scroll Fade**: As scrolling begins (`progress: 0.0 → 0.28`), the title smoothly glides upward and dissolves, while the top navigation bar fades in and locks at the top.

---

## 2. Unified Camera Zoom-Out Architecture
- **Single Camera Rig**: Treat the entire driftwood desk, photograph, and open vintage journal as a single cohesive physical scene.
- **Initial Zoom State (`progress = 0`)**: The camera is zoomed tightly into the photograph so the Namibian landscape fills 100% of the viewport edge-to-edge. The desk surface and journal naturally sit outside the zoomed-in camera frame.
- **Camera Pull-Back (`progress: 0 → 1.0`)**: 
  - As the user scrolls, the unified camera smoothly dollies straight back.
  - The photo naturally recedes into its designated position on the table with its white archival border and realistic optical contact shadow.
  - The driftwood table and the open vintage journal naturally enter the camera's field of view without fading in artificially or overlapping the photo.
- **Desk Settled State (`progress = 1.0`)**:
  - The full driftwood table fills the viewport edge-to-edge.
  - The photograph rests on the left side of the table (standard 3:2 ratio).
  - The complete open vintage journal rests on the right side with zero white fringe and natural warm daylight shadow.
  - The top navigation bar is permanently docked at the top.

---

## 3. Interactive Physics & Re-Centering Zoom-Back
- **Movable Objects**: Once the table is fully revealed (`progress > 0.65`), both the photograph and the journal can be freely dragged anywhere on the table.
- **Dynamic Z-Index Stacking**: Clicking or dragging either object brings it to the top layer.
- **Seamless Zoom-Back**: When scrolling back up, any user-dragged displacement smoothly eases back to `(0, 0)`, ensuring the camera zooms right back into the photo centered edge-to-edge.
