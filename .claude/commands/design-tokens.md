# CallShield Design Tokens

Use these tokens consistently across all UI work. They are defined as CSS variables in `app/assets/css/main.css`.

## Colors

### Primary Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#2563EB` | Primary actions, active tabs, links |
| `--color-primary-light` | `#3B82F6` | Hover states, light accents |
| `--color-primary-dark` | `#1D4ED8` | Pressed states |

### Semantic Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-success` | `#10B981` | Verified/safe callers, positive actions |
| `--color-success-light` | `#34D399` | Success backgrounds |
| `--color-success-dark` | `#059669` | Success pressed states |
| `--color-warning` | `#F59E0B` | Low-confidence spam, caution states |
| `--color-warning-light` | `#FBBF24` | Warning backgrounds |
| `--color-warning-dark` | `#D97706` | Warning pressed states |
| `--color-danger` | `#EF4444` | High-confidence spam, destructive actions |
| `--color-danger-light` | `#F87171` | Danger backgrounds |
| `--color-danger-dark` | `#DC2626` | Danger pressed states |

### Neutral Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-blocked` | `#6B7280` | Blocked/unknown state |
| `--color-background` | `#F9FAFB` | Page background |
| `--color-card` | `#FFFFFF` | Card surfaces |
| `--color-border` | `#E5E7EB` | Borders, dividers |
| `--color-text` | `#1F2937` | Primary text |
| `--color-text-secondary` | `#6B7280` | Secondary/helper text |

### Dark Mode (auto via `prefers-color-scheme: dark`)

| Token | Dark Value |
|-------|-----------|
| `--color-background` | `#111827` |
| `--color-card` | `#1F2937` |
| `--color-border` | `#374151` |
| `--color-text` | `#F9FAFB` |
| `--color-text-secondary` | `#9CA3AF` |

### Classification Color Map

| Classification | Tailwind Classes | Ionic Color |
|---------------|-----------------|-------------|
| `verified` / `safe` | `bg-green-100 text-green-600` | `success` |
| `contact` | `bg-blue-100 text-blue-600` | `primary` |
| `low_spam` | `bg-amber-100 text-amber-600` | `warning` |
| `high_spam` | `bg-red-100 text-red-600` | `danger` |
| `unknown` / `blocked` | `bg-gray-100 text-gray-500` | `medium` |

## Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` | Tight gaps, icon spacing |
| `--space-sm` | `8px` | Small gaps between related items |
| `--space-md` | `16px` | Standard padding, card padding |
| `--space-lg` | `24px` | Section spacing |
| `--space-xl` | `32px` | Large section gaps |
| `--space-2xl` | `48px` | Page-level spacing |

Tailwind equivalents: `gap-1`(4px), `gap-2`(8px), `gap-3`(12px), `gap-4`(16px), `p-4`(16px), `p-5`(20px), `py-12`(48px)

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `8px` | Small elements, inputs |
| `--radius-md` | `12px` | Buttons, search bars |
| `--radius-lg` | `16px` | Cards, modals |
| `--radius-xl` | `24px` | Large containers |
| `--radius-full` | `9999px` | Pills, badges, avatars |

Tailwind equivalents: `rounded-lg`(8px), `rounded-xl`(12px), `rounded-2xl`(16px), `rounded-full`

## Typography

| Token | Value | Usage |
|-------|-------|-------|
| `--font-sans` | `'Inter', system stack` | All UI text |
| `--font-mono` | `'JetBrains Mono'` | Phone numbers |

### Font Weights (Inter)
- `400` - Body text
- `500` - Medium emphasis (labels, nav)
- `600` - Semi-bold (section headers)
- `700` - Bold (stats, numbers, titles)

### Text Sizes (Tailwind)
- `text-xs` (12px) - Metadata, timestamps, labels
- `text-sm` (14px) - Helper text, secondary info
- `text-base` (16px) - Body text (default)
- `text-lg` (18px) - Subheadings
- `text-xl` (20px) - Stat numbers
- `text-2xl` (24px) - Large phone numbers
- `text-3xl` (30px) - Hero numbers
- `text-5xl` (48px) - Empty state icons

## Shadows

| Usage | Value |
|-------|-------|
| Card | `0 1px 3px rgba(0, 0, 0, 0.1)` |
| Dark card | `0 1px 3px rgba(0, 0, 0, 0.3)` |

## Utility Classes (defined in main.css)

```css
.text-primary    /* var(--color-primary) */
.text-success    /* var(--color-success) */
.text-warning    /* var(--color-warning) */
.text-danger     /* var(--color-danger) */
.text-secondary  /* var(--color-text-secondary) */
.bg-primary      /* var(--color-primary) */
.bg-success      /* var(--color-success) */
.bg-warning      /* var(--color-warning) */
.bg-danger       /* var(--color-danger) */
.card            /* Card surface with padding, radius, shadow */
.font-mono       /* JetBrains Mono for phone numbers */
.safe-area-*     /* Safe area insets for mobile */
```

## Theme Color

- **Meta theme**: `#2563EB`
- **StatusBar**: Light content, `#2563EB` background
- **Notification icon color**: `#2563EB`
- **Platform backgrounds**: `#F9FAFB` (Android/iOS)
