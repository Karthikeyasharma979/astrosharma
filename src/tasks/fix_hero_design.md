# Task: Redesign Hero Section to "Cosmic Temple" Aesthetic

## Context
The user wants to fix the "bad/worst" look of the current Hero section. The goal is to achieve a premium, divine "Cosmic Temple" aesthetic similar to the provided reference image (Step 250). The current implementation suffers from poor image masking, disjointed composition, and a lack of visual cohesion.

## Objective
Redesign the `Hero.jsx` component to create a visually stunning, cohesive, and premium "Deity in Orbit" visualization.

## Implementation Plan

### 1. Central Deity Visualization
*   **Issue**: The current deity image is a square block floating inside a circle.
*   **Fix**:
    *   Use **CSS Masking / Radial Gradients** to blend the edges of the deity image into the background, removing the harsh rectangular borders.
    *   Create a **"Golden Portal"** container: A distinct, glowing golden ring that frames the deity.
    *   **Background**: Use a deep cosmic blue/purple gradient *behind* the image, blending with the image's own background if possible, or using a vignette to hide the transition.

### 2. Zodiac Orbit System
*   **Issue**: The current orbit line is too faint, and the constellation nodes look disconnected.
*   **Fix**:
    *   **Solid Golden Ring**: Create a more defined, elegant golden ring for the orbit.
    *   **Constellation Coins**: style the constellation nodes as "floating celestial coins" – circular medallions with a glassmorphism effect (frosted glass) and golden borders.
    *   **Counter-Rotation**: Ensure the icons stay upright as they orbit (if not already handled, though CSS `rotate` usually handles parent/child counter-rotation if simpler, otherwise use specific transforms).

### 3. Atmosphere & Lighting
*   **Issue**: The scene looks flat.
*   **Fix**:
    *   Add **"God Rays"**: Subtle rotating light beams radiating from the center.
    *   **Stardust Trails**: Refine the elliptical "galaxy ring" to look smoother and more ethereal (using better CSS gradients/box-shadows).
    *   **Glow Effects**: Add stronger, warmer glows around the central portal to emphasize divinity.

### 4. Code Structure Changes (`Hero.jsx` & `index.css`)
*   **`Hero.jsx`**:
    *   Simplify the DOM structure for the central visual.
    *   Replace the complex "stardust" div with a cleaner CSS-based glow.
    *   Update the `img` styles to `object-cover` (with `object-top` positioning) to fill the frame properly, or use `mask-image`.
*   **`index.css`**:
    *   Add utility classes for the specific "Golden Portal" gradient and shadow effects.

## Reference Aesthetic
*   **Theme**: "Cosmic Temple" (Vedic Astrology meets Space).
*   **Colors**: Deep Void Blue (`#0B0F19`), Temple Gold (`#D4AF37`), Divine Saffron (`#F97316`).
*   **Vibe**: Mystical, Premium, Divine, Ancient yet Modern.

## Step-by-Step
1.  **CSS Polish**: Define new animations and gradients in `index.css` (or inline via Tailwind) for the "portal glow" and "floating coins".
2.  **Deity Layer**: Refactor the central `motion.div` in `Hero.jsx` to properly frame the `annapurna_devi.png`.
3.  **Orbit Refinement**: Update the mapping loop for constellations to use the new "Coin" style.
4.  **Review**: Verify the visual against the "premium" benchmark.
