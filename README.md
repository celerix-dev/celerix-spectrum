# 🪐 Celerix Spectrum

Framework-agnostic primitives for color and layout. Build your own UI on a solid foundation of OKLCH dynamics and systematic spacing powered by UnoCSS.

---
> [!IMPORTANT]
> ### 🏗️ Initial Development (v0.x)
> **Celerix Spectrum** is currently in active development. We are building out the core OKLCH engine and UnoCSS primitives. Expect frequent updates and breaking changes as we approach our first stable release. 🪐

## 🚀 Usage (Vue 3)

To initialize the theming engine and inject the spectrum state:

~~~typescript
import { createApp } from 'vue'
import { createSpectrum } from "celerix-spectrum/vue";

const app = createApp(App)

// prefix is optional, defaults to 'cx'
app.use(createSpectrum({ prefix: 'cx' }))
app.mount('#app')
~~~

### Accessing State
In any component, you can hook into the live spectrum values:

~~~vue
<script setup lang="ts">
  import { useSpectrum } from "celerix-spectrum/vue";
  const { state } = useSpectrum();
</script>

<template>
  <div :style="{ color: `oklch(${state.light.lightness} ${state.light.chroma} ${state.light.hue})` }">
    Current Hue: {{ state.light.hue }}
  </div>
</template>
~~~

---

## 🛠️ The Playground (Development Tool)
Celerix Spectrum includes a high-level Playground component. Drop it into your developer console or settings page to visualize your OKLCH math, test WCAG compliance, and generate presets in real-time.

~~~vue
<script setup lang="ts">
import { useSpectrum, Playground } from "@celerix/spectrum/vue";
const spectrum = useSpectrum();
</script>

<template>
    <Playground :spectrum="spectrum" />
</template>
~~~

<div align="center">
  <img src="./docs/assets/Playground.png" alt="Celerix Spectrum Playground" width="800">
  <p><i>The Celerix Playground: Real-time LCH mixing and WCAG validation.</i></p>
</div>

---

## 🏗️ Dynamic Layout Primitives (UnoCSS)

Celerix Spectrum moves away from static classes. Use dynamic rules to define your layout dimensions directly in your HTML.

### 1. The Magic Dashboard
Control your entire application shell with a single class. It automatically assigns `<header>`, `<aside>`, `<main>`, and `<footer>` to their respective grid areas.

| Class Pattern | Description |
| :--- | :--- |
| `cx-layout-[sb]-[hd]` | Sidebar width + Header height (e.g., `cx-layout-350-60`) |
| `cx-layout-[sb]-[hd]-[ft]` | Sidebar + Header + Footer (e.g., `cx-layout-350-60-40`) |

### 2. Auto-Grids (Responsive Cards)
The "Holy Grail" of responsive design. No media queries required.
* **Pattern:** `cx-grid-[min-width]`
* **Example:** `cx-grid-300` (Cards stay at least 300px wide, or stack to 100% on mobile).

### 3. Systematic Spacing
Uses the `--s-[n]` scale for Padding, Margin, and Gap. Supports `!important` suffix.
* **Pattern:** `[type][direction]-[scale]`
* **Example:** `p-4`, `mx-auto`, `gc-3` (column gap), `p-2-important`

---

## ⚡ Utility Atoms & Shortcuts

Quick-hit classes for building fast, consistent layouts.

| Category | Shortcuts / Atoms |
| :--- | :--- |
| **Display** | `d-flex`, `d-grid`, `d-block`, `d-none` |
| **Flexbox** | `flex-center`, `flex-jc-between`, `flex-ai-center`, `flex-dir-col` |
| **Position** | `pos-relative`, `pos-absolute`, `abs-center`, `fixed-cover` |
| **Sizing** | `w-full`, `h-dvh`, `size-full`, `aspect-square` |
| **Interaction** | `cursor-pointer`, `select-none`, `pointer-events-none` |
| **Special** | `cx-glass` (Frosted glass effect), `text-truncate` |

---

## 🎨 Color Philosophy

Celerix Spectrum is built on **Perceptual Uniformity**.

By using **OKLCH**, we ensure that your brand colors maintain consistent contrast and vibrancy across the entire lightness scale. Unlike RGB or HEX, OKLCH allows for mathematically precise color shifts that look natural to the human eye.
