# Component Library Integration

**MRBS Specification v1.0 - Connecting Brand Systems to Design Systems**

Version: 1.0
Status: Final
Updated: 2025-01-19

---

## Overview

This document defines the relationship between MRBS (brand identity) and component libraries (design system implementation), and provides patterns for integration.

---

## Relationship

```
┌─────────────────────────────────────────────┐
│ MRBS (Source of Truth)                      │
│ - Colors, Typography, Spacing               │
│ - Brand Rules & Constraints                 │
│ - Voice, Tone, Values                       │
└──────────────────┬──────────────────────────┘
                   │ Consumes
                   ▼
┌─────────────────────────────────────────────┐
│ Component Library (Implementation)          │
│ - React/Vue/Web Components                  │
│ - Button, Card, Modal, etc.                 │
│ - Applies MRBS tokens                       │
└─────────────────────────────────────────────┘
```

**Key Principle:** MRBS defines "what" (brand identity), component libraries implement "how" (UI patterns).

---

## Token Export

### Style Dictionary Integration

[Style Dictionary](https://amzn.github.io/style-dictionary/) transforms MRBS tokens into platform-specific formats.

**config.json:**
```json
{
  "source": ["mrbs/visual/**/*.tokens.json"],
  "platforms": {
    "css": {
      "transformGroup": "css",
      "buildPath": "dist/css/",
      "files": [{
        "destination": "variables.css",
        "format": "css/variables"
      }]
    },
    "scss": {
      "transformGroup": "scss",
      "buildPath": "dist/scss/",
      "files": [{
        "destination": "_variables.scss",
        "format": "scss/variables"
      }]
    },
    "javascript": {
      "transformGroup": "js",
      "buildPath": "dist/js/",
      "files": [{
        "destination": "tokens.js",
        "format": "javascript/es6"
      }]
    },
    "json": {
      "transformGroup": "js",
      "buildPath": "dist/json/",
      "files": [{
        "destination": "tokens.json",
        "format": "json/flat"
      }]
    }
  }
}
```

**Output (CSS):**
```css
:root {
  --color-brand-primary: #0066CC;
  --color-neutral-white: #FFFFFF;
  --font-family-heading: Inter;
  --font-family-body: Source Sans Pro;
  --spacing-md: 16px;
}
```

### Direct Import

**JavaScript/TypeScript:**
```typescript
// Import MRBS tokens directly
import colors from '@brand/mrbs/visual/colors.tokens.json';
import typography from '@brand/mrbs/visual/typography.tokens.json';

// Use in styled-components
import styled from 'styled-components';

const Button = styled.button`
  background-color: ${colors.color.brand.primary.$value};
  font-family: ${typography.typography.font_family.body.$value};
  padding: ${colors.spacing?.scale?.md?.$value || '16px'};
`;
```

**CSS-in-JS (Emotion):**
```typescript
import { css } from '@emotion/react';
import tokens from '@brand/mrbs/dist/tokens.json';

const buttonStyles = css`
  background-color: ${tokens.colorBrandPrimary};
  font-family: ${tokens.fontFamilyBody};
`;
```

---

## Component Documentation

Components should reference MRBS sources:

```tsx
/**
 * Button Component
 *
 * @see MRBS: visual/colors.tokens.json - Primary color
 * @see MRBS: rules/constraints.yaml - Button sizing constraints
 * @see MRBS: rules/accessibility.yaml - Touch target requirements (44x44px)
 *
 * @example
 * <Button variant="primary">Click Me</Button>
 */
export function Button({ variant = 'primary', children, ...props }) {
  return (
    <button
      className={`btn btn-${variant}`}
      style={{
        // Meets accessibility.yaml touch target requirement
        minHeight: '44px',
        minWidth: '44px'
      }}
      {...props}
    >
      {children}
    </button>
  );
}
```

---

## Validation Against Brand Rules

```typescript
// validate-component.ts
import { validateColorUsage, validateTypography } from '@brand/mrbs-validator';
import mrbs from '@brand/mrbs';

export function validateComponent(componentName: string, styles: any) {
  const results = {
    colors: validateColorUsage(styles.colors, mrbs.visual.colors),
    typography: validateTypography(styles.fonts, mrbs.visual.typography),
    spacing: validateSpacing(styles.spacing, mrbs.visual.spacing)
  };

  return {
    valid: Object.values(results).every(r => r.valid),
    results
  };
}
```

---

## Build Pipeline Integration

```json
// package.json
{
  "scripts": {
    "build:tokens": "style-dictionary build",
    "validate:mrbs": "mrbs-validator ./mrbs",
    "prebuild": "npm run build:tokens && npm run validate:mrbs",
    "build": "vite build"
  }
}
```

---

## Best Practices

1. **MRBS as single source of truth** - Never hardcode brand values in components
2. **Validate components** - Ensure adherence to brand constraints
3. **Document token usage** - Link components to MRBS sources
4. **Automate token updates** - Regenerate when MRBS changes
5. **Version sync** - Match component library version to MRBS version

---

## Example Integrations

### React + Tailwind CSS

```javascript
// tailwind.config.js
import colors from './mrbs/visual/colors.tokens.json';
import typography from './mrbs/visual/typography.tokens.json';
import spacing from './mrbs/visual/spacing.tokens.json';

export default {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: colors.color.brand.primary.$value,
          secondary: colors.color.brand.secondary.$value
        },
        neutral: Object.fromEntries(
          Object.entries(colors.color.neutral).map(([key, val]) => [key, val.$value])
        )
      },
      fontFamily: {
        heading: [typography.typography.font_family.heading.$value, ...typography.typography.font_family.heading.fallback],
        body: [typography.typography.font_family.body.$value, ...typography.typography.font_family.body.fallback]
      },
      spacing: Object.fromEntries(
        Object.entries(spacing.spacing.scale).map(([key, val]) => [key, val.$value])
      )
    }
  }
};
```

### Vue + SCSS

```scss
// _brand-tokens.scss (generated from MRBS)
$color-brand-primary: #0066CC;
$color-neutral-white: #FFFFFF;
$font-family-heading: Inter;
$spacing-md: 16px;

// component.vue
<style lang="scss">
@import '@brand/tokens';

.button {
  background-color: $color-brand-primary;
  font-family: $font-family-heading;
  padding: $spacing-md;
}
</style>
```

### Web Components

```typescript
// brand-button.ts
import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import tokens from '@brand/mrbs/dist/tokens.json';

@customElement('brand-button')
export class BrandButton extends LitElement {
  static styles = css`
    :host {
      --button-bg: ${tokens.colorBrandPrimary};
      --button-font: ${tokens.fontFamilyBody};
    }

    button {
      background-color: var(--button-bg);
      font-family: var(--button-font);
      min-height: 44px;
      min-width: 44px;
    }
  `;

  render() {
    return html`<button><slot></slot></button>`;
  }
}
```

---

## Conclusion

Component libraries should consume MRBS tokens rather than duplicate brand definitions. This ensures consistency and enables centralized brand updates.

For questions, open an issue at the [MRBS repository](https://github.com/MRBSystem/MRBS-Specification).
