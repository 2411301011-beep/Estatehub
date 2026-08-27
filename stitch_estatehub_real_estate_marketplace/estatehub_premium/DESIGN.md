---
name: EstateHub Premium
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#775a19'
  on-secondary: '#ffffff'
  secondary-container: '#fed488'
  on-secondary-container: '#785a1a'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#111c2d'
  on-tertiary-container: '#79849a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#ffdea5'
  secondary-fixed-dim: '#e9c176'
  on-secondary-fixed: '#261900'
  on-secondary-fixed-variant: '#5d4201'
  tertiary-fixed: '#d8e3fb'
  tertiary-fixed-dim: '#bcc7de'
  on-tertiary-fixed: '#111c2d'
  on-tertiary-fixed-variant: '#3c475a'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
  price-display:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: -0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  section-gap: 80px
---

## Brand & Style
The design system is engineered to evoke a sense of heritage, stability, and exclusive luxury within the Indian real-estate market. It targets high-net-worth individuals and aspirational buyers who value transparency and architectural beauty. 

The aesthetic follows a **Modern-Corporate** direction with **Minimalist** sensibilities. It prioritizes high-fidelity property photography as the primary visual driver, framed by a structured, systematic UI that communicates institutional trust. The interface balances the "old world" prestige of the Indian luxury market with the efficiency of a high-tech marketplace.

## Colors
The palette is rooted in a deep Navy (#0F172A) and Charcoal (#1E293B) to establish authority and depth. Warm Gold (#C5A059) is used sparingly as a "prestige" accent for primary actions, verified statuses, and premium highlights.

- **Primary (Navy):** Used for headers, footers, and heavy text to anchor the page.
- **Secondary (Gold):** Reserved for high-conversion CTAs and premium iconography.
- **Neutral:** A range of cool grays and off-whites are used to prevent the interface from feeling "flat" while maintaining a clean, gallery-like backdrop for photography.
- **Surface:** Pure white is used for property cards and interactive components to ensure maximum contrast against the neutral background.

## Typography
The typographic hierarchy employs a "High-Contrast Pairing" strategy. 

**Playfair Display** provides an editorial, sophisticated feel for headlines and property titles. **Inter** handles the functional aspects of the UI, ensuring that technical property details, Rupee pricing, and legal disclosures remain highly legible. 

Numeric data—specifically pricing with the ₹ symbol—should always use Inter with a semi-bold weight to ensure clarity in high-density data views.

## Layout & Spacing
The layout follows a **Fixed Grid** system for desktop (12 columns) to maintain an organized, premium feel. Generous white space (section-gap) is prioritized to avoid the "cluttered" look common in mass-market real-estate portals.

- **Desktop:** 12-column grid, 1280px max-width, 24px gutters.
- **Tablet:** 8-column grid, 16px gutters.
- **Mobile:** 4-column grid, 16px margins, fluid stacking.

Padding within components (like cards) should be generous (min 24px) to emphasize the high-end nature of the listings.

## Elevation & Depth
Depth is achieved through **Ambient Shadows** and tonal layering rather than heavy borders.

- **Level 1 (Base):** Neutral background (#F8FAFC).
- **Level 2 (Cards/Containers):** Pure White (#FFFFFF) with a very soft, diffused shadow: `0px 4px 20px rgba(15, 23, 42, 0.05)`.
- **Level 3 (Hover/Floating):** Increased shadow spread and slightly higher opacity to indicate interactivity: `0px 12px 32px rgba(15, 23, 42, 0.1)`.

Sticky headers should use a slight backdrop blur (12px) with 95% opacity of the primary Navy color to maintain focus on content while scrolling.

## Shapes
A **Rounded** shape language (0.5rem / 8px base) is used for buttons and inputs. However, **Property Cards** and large containers use a specific `rounded-xl` (1.5rem / 24px) or `rounded-lg` (1rem / 16px) radius to soften the large photography and create a modern, approachable feel.

Badges and "Verified" tags should use a full pill-shape to distinguish them from functional buttons.

## Components
- **Property Cards:** Must feature a 16:9 aspect ratio image container. Pricing (₹) is positioned in the bottom-left of the image overlay or top of the info section in Inter Semi-bold.
- **Verified Badge:** A gold (#C5A059) pill with a small check icon, used only for vetted listings.
- **Primary Buttons:** Solid Gold background with Navy text for maximum contrast and "luxury" feel.
- **Input Fields:** Large, 56px height for search bars with soft 8px corners and subtle 1px border (#E2E8F0).
- **Sticky Search Bar:** On scroll, the search interface should condense into a slim, sophisticated bar pinned to the top of the viewport.
- **Price Formatting:** Always include the Rupee symbol (₹) followed by Indian numbering system formatting (e.g., ₹1.25 Cr or ₹95 Lakhs).