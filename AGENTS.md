# AGENTS.md

## Urca Design Factory — Codex Project Instructions

This repository contains the Urca Design Factory website and its design system.

Read these documents before making visual or architectural decisions:

- `/docs/CREATIVE-DIRECTION.md`
- `/docs/CONTENT-ARCHITECTURE.md`

These files are the source of truth for brand direction and content structure.

---

# 1. Primary Objective

Build a highly crafted global studio website combining:

**editorial design + computational graphics + production-quality engineering**

The result must not look like a generic agency template, SaaS landing page or developer portfolio.

---

# 2. Decision Priority

When making decisions, use this order:

1. Creative direction
2. Accessibility
3. Content hierarchy
4. Responsive behavior
5. Performance
6. Maintainability
7. Novelty

Novel effects must never compromise the preceding priorities.

---

# 3. Design Rules

Prefer:

- typography-led compositions
- editorial grids
- deliberate whitespace
- asymmetric layouts
- strong hierarchy
- large project imagery
- minimal interface chrome
- restrained motion
- procedural ASCII graphics
- subtle details

Avoid:

- generic card grids
- excessive pills
- glassmorphism
- arbitrary gradients
- large drop shadows
- excessive rounded rectangles
- generic startup illustrations
- generic dashboard aesthetics
- unnecessary UI decoration

Do not introduce a visual pattern merely because it is common in modern frontend design.

---

# 4. Existing Brand Assets

Use provided SVG brand assets whenever possible.

Do not recreate the Urca wordmark using text.

Do not manually redraw master logo assets.

Preserve SVG proportions.

Use correct variants according to the background.

---

# 5. Design Tokens

All reusable visual values must originate from shared tokens.

Never introduce arbitrary values repeatedly across components.

Foundation categories:

- color
- typography
- spacing
- sizing
- grid
- border
- radius
- motion
- easing
- breakpoints
- z-index

Initial color references:

```css
--color-canvas: #fbfbf9;
--color-ink: #1d1d1b;
--color-signal: #d95a2f;
```

Additional neutral values must be added intentionally and centrally.

Do not create a large color palette before it is required.

---

# 6. Typography

Maintain three roles:

- display serif
- neutral grotesk
- monospace

Do not select or import arbitrary fonts without documenting why.

Typography must be tested at:

- large desktop
- laptop
- tablet
- narrow mobile

Use fluid typography where appropriate.

Avoid excessive breakpoint-specific font-size overrides when `clamp()` can express the intended scale clearly.

---

# 7. Layout

Desktop foundation should use a 12-column editorial grid.

The grid is a compositional framework, not a rule that every section must visibly obey.

Maintain consistent page gutters.

Do not solve every composition with centered max-width containers.

Mobile layouts must be intentionally recomposed.

Do not simply shrink desktop.

---

# 8. Components

Prefer fewer, stronger primitives.

Do not prematurely create components for one-off compositions.

Extract a component when:

- it repeats,
- it represents a stable design-system primitive,
- it has meaningful behavior,
- or abstraction materially improves maintainability.

Avoid creating generic components whose prop APIs become more complicated than the markup they replace.

---

# 9. ASCII System

ASCII graphics are a core brand primitive.

They are not decorative developer jokes.

Build ASCII behavior as a reusable graphics system.

Potential primitives:

```txt
AsciiField
AsciiImage
AsciiMorph
AsciiNoise
AsciiText
```

Do not implement all primitives before they are needed.

Start with the smallest architecture capable of supporting the hero prototype.

---

# 10. ASCII Architecture

Centralize:

- character ramps
- density rules
- sampling logic
- render parameters
- motion parameters
- performance thresholds

Do not hard-code character ramps separately in page components.

Suggested configuration concept:

```ts
type AsciiDensity = "sparse" | "medium" | "dense";

type AsciiBehavior =
  | "static"
  | "breathe"
  | "drift"
  | "cursor"
  | "dissolve";

type AsciiFieldProps = {
  density?: AsciiDensity;
  behavior?: AsciiBehavior;
  interactive?: boolean;
};
```

This example is conceptual, not a requirement to reproduce the API exactly.

Choose the simplest API that fits actual usage.

---

# 11. ASCII Visual Rules

ASCII output should be:

- abstract
- spacious
- refined
- responsive
- typographically aligned

Avoid:

- Matrix aesthetics
- green terminal visuals
- fake command-line windows
- binary rain
- hacker clichés
- excessive glitch
- constant random movement

Use monospace rendering with stable character metrics.

---

# 12. ASCII Performance

ASCII effects must degrade gracefully.

Account for:

- small screens
- high-DPI screens
- slow devices
- reduced motion
- background tabs
- battery usage

Do not render at native display resolution unless necessary.

Prefer controlled sampling resolution.

Animation loops should pause when not visible where practical.

Avoid unnecessary React state updates per animation frame.

Use `requestAnimationFrame` appropriately.

Profile before increasing effect complexity.

---

# 13. Reduced Motion

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

Users requesting reduced motion should receive a stable composition without losing information.

ASCII artwork can become static.

Transitions should complete immediately or use minimal fades.

---

# 14. Accessibility

Maintain semantic HTML.

All interactive elements must be keyboard accessible.

Visible focus states are required.

Decorative ASCII must not create meaningless screen-reader output.

Use appropriate strategies such as:

```html
aria-hidden="true"
```

for purely decorative character graphics.

Do not put meaningful content exclusively inside canvas or graphical effects.

Maintain acceptable contrast.

Use heading hierarchy correctly.

---

# 15. Motion

Motion must support hierarchy or interaction.

Do not animate merely because animation is available.

Preferred:

- reveal
- opacity
- mask
- transform
- character density
- controlled morphing

Avoid stacking several independent effects on the same element.

Default motion should feel precise rather than bouncy.

---

# 16. Images

Use responsive image delivery.

Use the framework image tooling where appropriate.

Avoid enormous source assets when smaller production variants are sufficient.

Preserve project art direction.

Do not force every image into the same aspect ratio if the composition benefits from variation.

---

# 17. CSS

Prefer design tokens via CSS custom properties.

Utility classes may consume tokens.

Do not bury the brand system exclusively inside framework configuration.

Avoid inline arbitrary values when a reusable token exists.

Do not add global CSS rules without understanding their effects.

---

# 18. JavaScript

Use client-side JavaScript only where behavior requires it.

Do not make static editorial content client-rendered unnecessarily.

Keep interactive islands isolated when practical.

Prioritize initial page performance.

---

# 19. Responsive Behavior

Required baseline testing:

- ~1440px desktop
- ~1024px laptop/tablet landscape
- ~768px tablet
- ~390px mobile

Also test unusually narrow and wide conditions.

Do not optimize for one screenshot width.

---

# 20. Browser Quality

Before declaring a visual milestone complete, check:

- typography
- wrapping
- clipping
- spacing
- hover
- keyboard navigation
- reduced motion
- mobile composition
- loading behavior
- layout shifts
- console errors

---

# 21. Content

Do not invent:

- clients
- testimonials
- awards
- project outcomes
- metrics
- partnerships

Use placeholder content only when clearly identified as placeholder.

Do not write generic marketing filler to make a layout look populated.

---

# 22. Homepage Development Strategy

Do not build the full website immediately.

First milestone:

**Homepage Art Direction Prototype**

Initial scope:

- global shell
- brand asset integration
- typography foundation
- base colors
- responsive grid
- navigation
- hero
- hero ASCII experiment
- first selected-work composition
- foundational motion

Do not implement the remaining homepage sections until this milestone has been reviewed.

---

# 23. Design System Strategy

Do not build a comprehensive component library before the art direction has been validated in the browser.

Workflow:

**creative direction**

→ **exemplar homepage**

→ **visual review**

→ **extract stable tokens and primitives**

→ **build remaining pages**

The real interface should inform the design system.

---

# 24. Refactoring

After a visual direction is approved:

1. identify repeated values,
2. identify repeated behaviors,
3. identify repeated compositions,
4. extract stable abstractions,
5. remove experimental dead code.

Do not prematurely refactor active visual exploration.

---

# 25. Code Quality

Use clear names.

Keep components focused.

Avoid deeply nested prop-driven abstractions.

Delete abandoned experiments.

Do not leave console logging or commented obsolete code.

Run available formatting, linting and tests after meaningful changes.

---

# 26. Working Method

For non-trivial tasks:

1. inspect the relevant repository files,
2. summarize what exists,
3. propose a short implementation plan,
4. implement,
5. run appropriate checks,
6. summarize changes and unresolved issues.

Do not start major architectural rewrites before understanding the current implementation.

---

# 27. Visual Self-Review

Before finishing a visual task, ask:

- Does this feel editorial or templated?
- Is the typography doing enough of the work?
- Is there unnecessary UI?
- Is the whitespace intentional?
- Does the ASCII feel like art or a demo?
- Is the interaction calmer than it needs to be?
- Does the project content remain more important than the website effect?
- Would removing an element improve the composition?

If yes to the final question, remove it.

---

# 28. Core Rule

**Do not optimize Urca for looking like a modern website.**

Optimize it for looking unmistakably like **Urca Design Factory**.
