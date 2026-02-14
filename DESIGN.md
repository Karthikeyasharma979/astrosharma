# Design System & Documentation
> **Project:** Astro Application
> **Theme:** Scientific & Mystical Astrology Platform
> **Tech Stack:** React (Vite), Tailwind CSS v4, Framer Motion, Lucide React

---

## 🎨 Color Palette & Theming

The application uses a dual-theme system (Light/Dark) with a specific focus on deep, cosmic colors for dark mode and clean, warm tones for light mode.

### 1. Primary Colors (Tailwind Config)
These are defined in `tailwind.config.js` under `colors.astro`.

| Token | Hex Value | Description | Usage |
| :--- | :--- | :--- | :--- |
| `astro-dark` | `#0B0F19` | Midnight Blue | Main background in Dark Mode. Deep and immersive. |
| `astro-purple` | `#4C1D95` | Nebula Purple | Accents, gradients, and secondary elements. |
| `astro-gold` | `#F59E0B` | Celestial Gold | Highlights, icons, and call-to-action buttons. |
| `astro-text` | `#F3F4F6` | Starlight Text | Primary text color in Dark Mode. |
| `astro-card` | `rgba(17, 24, 39, 0.7)` | Glassy Dark | Background for cards in Dark Mode (Glassmorphism). |

### 2. Gradient Styles (`index.css`)
Consistent gradient usage for text and special backgrounds.

**Text Gradient (`.text-gradient`):**
- **Light Mode:** `from-orange-600 via-orange-500 to-red-600`
- **Dark Mode:** `from-orange-400 via-orange-200 to-red-500`
- **Effect:** Keeps text readable while adding a fiery, spirited look.

**Hero Title Gradient:**
- **Light Mode:** `from-orange-700 via-red-600 to-orange-700`
- **Dark Mode:** `from-orange-400 via-red-400 to-orange-400`
- **Usage:** Specifically for the main H1 title to give it extra weight and intensity.

### 3. Backgrounds & Atmosphere (`index.css` & `Hero.jsx`)
- **Light Mode:** `bg-gray-50` (Clean, academic feel).
- **Dark Mode:** `bg-astro-dark` with `.star-bg`.
- **Texture:** A noise overlay (`noise.svg`) is often used with `opacity-20 mix-blend-overlay` to add grain and realism.
- **Ambient Glow:** Use large, blurred blobs (`blur-3xl`) in orange/purple/gold behind key sections to create depth.

---

## ✒️ Typography & Language

| Type | Font Family | Usage |
| :--- | :--- | :--- |
| **Headings** | `Playfair Display`, serif | Titles, Hero Text, Section Headers. Adds an elegant, mystical feel. |
| **Body** | `Inter`, sans-serif | Paragraphs, UI Elements, Data Display. Clean and readable. |
| **Language** | Telugu (Target) | Ensure fonts support Telugu characters gracefully. |

---

## 🧩 UI Patterns & Components

### 1. Glassmorphism Cards (`.glass-card`)
Used extensively for content containers to maintain depth and texture.
- **Base Style:** `backdrop-blur-md border shadow-xl rounded-[2rem]`
- **Light Theme:** `bg-white/80 border-gray-200`
- **Dark Theme:** `bg-astro-card border-white/10`
- **Decorative:** Often features "traditional corner borders" (thick colored borders at corners) for a sacred aesthetic.

### 2. Custom Animations (Tailwind Config)
Extended animation utilities for cosmic effects.

- `animate-spin-slow`: `spin 12s linear infinite` (For zodiac wheels/planet rotations).
- `animate-pulse-slow`: `pulse 4s cubic-bezier(...)` (For glowing stars/elements).
- `animate-float`: `float 6s ease-in-out infinite` (For levitating cards/images).
- `animate-spotlight`: A spotlight effect for hero sections.
- `animate-border-beam`: A moving border gradient effect.

### 3. Special UI Components (`src/components/ui`)
- **ShimmerButton:** A high-emphasis button with a shimmering animation.
- **BorderBeam:** Adds a moving gradient border to containers.
- **Spotlight:** A background effect that follows or focuses on an area.
- **Glowing Menu:** Navigation with hover glow effects.

---

## 📐 Layout Structure

### 1. Main Layout (`src/components/Layout.jsx`)
- Wraps all pages.
- Contains the `Navbar` (Header) and `Footer`.
- Handles global layout constraints (max-width, padding).

### 2. Page Structure
Every page (`src/pages/*.jsx`) should follow this structure:
```jsx
import React from 'react';
import { motion } from 'framer-motion'; 

const PageName = () => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen pt-20 pb-12 px-4 container mx-auto"
        >
            {/* Page Header */}
            <h1 className="font-serif text-4xl text-gradient mb-6">Page Title</h1>
            
            {/* Content within Glass Cards */}
            <div className="glass-card p-6 rounded-2xl">
                {/* Content Here */}
            </div>
        </motion.div>
    );
};

export default PageName;
```

---

## 🚀 Development Guidelines

1.  **Tailwind First:** Use utility classes for almost everything. Only use `index.css` for complex, reusable patterns (like `.star-bg`).
2.  **Dark Mode First:** Always test components in Dark Mode as it is the primary aesthetic. Ensure high contrast.
3.  **Responsiveness:** Use standard Tailwind breakpoints (`md:`, `lg:`). Mobile-first approach.
4.  **Icons:** Use `lucide-react` for consistent, clean iconography.
5.  **Motion:** Use `framer-motion` for entrances and complex interactions, and standard Tailwind classes (`transition-all duration-300`) for simple hover states.

---

## 📦 Required Dependencies
- `react-router-dom` (Routing)
- `framer-motion` (Animations)
- `lucide-react` (Icons)
- `clsx`, `tailwind-merge` (Class utility variants)
