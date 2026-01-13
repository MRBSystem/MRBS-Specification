# MRBS — Machine-Readable Brand System

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Specification Version](https://img.shields.io/badge/spec-v1.0.0-green.svg)](./specification/v1.0/SPEC.md)

**An open specification for AI-ready enterprise brand identity systems.**

---

## The Problem

Traditional brand identity systems were designed for human designers:

| Asset Type | Traditional Format | AI Accessibility |
|------------|-------------------|------------------|
| Logo usage rules | PDF pages with visual examples | ❌ Cannot parse |
| Color palette | Designed swatches in PDF | ⚠️ Values extractable, context lost |
| Typography | Font specimens | ⚠️ Names only, no usage rules |
| Spacing guidelines | Visual diagrams | ❌ Not machine-interpretable |
| Brand voice | Prose descriptions | ❌ Subjective, no validation |
| Templates | PSD/PPTX/INDD files | ⚠️ Usable but opaque |

When you ask an AI agent to *"create a presentation following our brand guidelines"*, it needs:

- **Structured rules** — not prose like "use plenty of white space"
- **Validation constraints** — what's allowed vs. forbidden
- **Semantic relationships** — why certain colors pair together
- **Contextual rules** — different rules for different contexts
- **Asset accessibility** — direct paths to approved assets

**PDF brandbooks cannot provide this.**

---

## The Solution: MRBS

The Machine-Readable Brand System (MRBS) specification defines a structured, semantic, and programmatically accessible format for brand identity that enables:

✅ **AI agents** to create brand-compliant content autonomously  
✅ **Validation tools** to check compliance programmatically  
✅ **Design systems** to consume tokens directly  
✅ **Multiple platforms** to share a single source of truth  
✅ **Version control** for brand evolution tracking  

### Core Principles

1. **Semantic over Visual** — Describe *meaning* and *intent*, not just appearance
2. **Rules as Code** — Transform prose guidelines into testable constraints
3. **Context-Aware** — Different rules for different contexts (formal, casual, etc.)
4. **Platform-Agnostic** — Works with any AI system, design tool, or platform
5. **Human + Machine** — Readable by both humans and AI agents

---

## Quick Start

### 1. Understand the Structure

An MRBS-compliant brand system follows this structure:

```
brand-system/
├── brand.manifest.json          # Master index — AI reads this first
├── identity/
│   ├── brand-values.yaml        # Mission, vision, personality
│   ├── voice-tone.yaml          # Writing guidelines by context
│   └── naming.yaml              # Naming conventions
├── visual/
│   ├── colors.tokens.json       # Color definitions + usage rules
│   ├── typography.tokens.json   # Font definitions + scales
│   ├── spacing.tokens.json      # Spacing system
│   └── effects.tokens.json      # Shadows, gradients, borders
├── assets/
│   ├── logos/                   # Logo files + manifest
│   ├── icons/                   # Icon library
│   └── photography/             # Photo guidelines + approved images
├── templates/
│   ├── presentation/            # Slide templates + manifest
│   ├── document/                # Document templates
│   └── email/                   # Email templates
├── rules/
│   ├── constraints.yaml         # Do's and don'ts
│   ├── accessibility.yaml       # WCAG requirements
│   └── legal.yaml               # Trademark, disclaimers
└── examples/
    ├── correct/                 # Approved examples
    └── incorrect/               # Anti-patterns with explanations
```

### 2. Explore the Example

The [`/example`](./example) directory contains a complete, neutral reference implementation you can use as a starting point.

### 3. Read the Specification

The full specification is at [`/specification/v1.0/SPEC.md`](./specification/v1.0/SPEC.md).

---

## Key Components

### Brand Manifest (`brand.manifest.json`)

The entry point for AI agents. Contains metadata and paths to all components:

```json
{
  "$schema": "https://mrbs.dev/schema/v1/brand.manifest.json",
  "mrbs_version": "1.0.0",
  "brand": {
    "name": "Acme Corporation",
    "tagline": "Innovation for tomorrow"
  },
  "components": {
    "visual": "./visual/",
    "identity": "./identity/",
    "assets": "./assets/",
    "templates": "./templates/",
    "rules": "./rules/"
  }
}
```

### Design Tokens (`colors.tokens.json`)

Colors with semantic meaning and usage rules:

```json
{
  "color": {
    "brand": {
      "primary": {
        "$value": "#0066CC",
        "$type": "color",
        "semantic_role": "brand_identity",
        "usage": ["headings", "cta_buttons", "links"],
        "prohibited_for": ["body_text", "large_backgrounds"],
        "pair_with": ["white", "neutral-100"],
        "min_contrast_ratio": 4.5
      }
    }
  }
}
```

### Voice Guidelines (`voice-tone.yaml`)

Structured writing rules by context:

```yaml
voice:
  core_attributes:
    - "Professional but approachable"
    - "Confident without arrogance"
    
contexts:
  formal:
    use_for: ["legal", "investor_relations", "contracts"]
    tone: "authoritative, precise"
    avoid: ["contractions", "colloquialisms"]
    
  conversational:
    use_for: ["blog", "social_media", "support"]
    tone: "warm, helpful, accessible"
    allow: ["contractions", "questions"]
```

### Template Manifests

Structured descriptions of templates with zones, constraints, and usage rules:

```json
{
  "layouts": [
    {
      "id": "title_slide",
      "purpose": "Opening slide for presentations",
      "zones": {
        "title": {
          "max_characters": 60,
          "typography": "heading_1"
        },
        "subtitle": {
          "max_characters": 120,
          "optional": true
        }
      }
    }
  ]
}
```

---

## AI Integration

### System Prompt Integration

```markdown
## Brand Guidelines

This conversation should follow MRBS brand guidelines located at:
[path/to/brand.manifest.json]

Quick reference:
- Primary color: #0066CC (headings, CTAs)
- Heading font: Inter (600, 700 weights)
- Voice: Professional but approachable
- Max bullets per slide: 6
```

### MCP Server

MRBS can be exposed via [Model Context Protocol](https://modelcontextprotocol.io):

```typescript
// Example MCP resource URIs
"brand://colors"           // Color tokens
"brand://typography"       // Typography tokens  
"brand://voice/formal"     // Voice guidelines for formal context
"brand://templates/presentation"  // Presentation templates
"brand://validate"         // Validation endpoint
```

### REST API

For enterprise deployments, MRBS can be served via REST:

```
GET  /brand/manifest
GET  /brand/colors
GET  /brand/templates/{type}
POST /brand/validate
```

---

## Specification Status

| Version | Status | Release Date |
|---------|--------|--------------|
| 1.0.0   | Current | January 2025 |

See [CHANGELOG.md](./CHANGELOG.md) for version history.

---

## Use Cases

### For Enterprises

- Enable any employee to create brand-compliant content with AI
- Eliminate designer bottlenecks for routine deliverables
- Ensure consistency across global teams and agencies
- Reduce revision cycles from 3-4 to 0-1

### For AI Tool Developers

- Standard format for brand guideline ingestion
- Validation schemas for compliance checking
- Clear integration patterns

### For Designers

- Single source of truth for brand systems
- Version-controlled brand evolution
- Automated compliance validation

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Ways to Contribute

- 🐛 Report issues or suggest improvements
- 📝 Improve documentation
- 🔧 Add validators or converters in `/tools`
- 🌍 Translate documentation
- 💡 Share implementation examples

---

## Community

- **Discussions**: [GitHub Discussions](https://github.com/MRBSystem/MRBS-Specification/discussions)
- **Issues**: [GitHub Issues](https://github.com/MRBSystem/MRBS-Specification/issues)

---

## License

This specification is licensed under [Apache 2.0](./LICENSE).

You are free to:
- Use the specification commercially
- Create MRBS-compliant brand systems
- Build tools that work with MRBS
- Modify and distribute

---

## Acknowledgments

MRBS builds on the work of:

- [Design Tokens W3C Community Group](https://www.w3.org/community/design-tokens/)
- [Style Dictionary](https://amzn.github.io/style-dictionary/)
- [Open Props](https://open-props.style/)
- [Model Context Protocol](https://modelcontextprotocol.io)

---

<p align="center">
  <strong>Making brand identity accessible to AI agents.</strong>
</p>
