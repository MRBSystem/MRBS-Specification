# AI Integration Guide

**MRBS Specification v1.0 - AI Integration Best Practices**

---

## Table of Contents

1. [Overview](#overview)
2. [Loading Strategy](#loading-strategy)
3. [Prompt Engineering](#prompt-engineering)
4. [Memory Systems](#memory-systems)
5. [Validation Hooks](#validation-hooks)
6. [MCP Integration](#mcp-integration)
7. [Best Practices](#best-practices)

---

## Overview

This document provides guidance for integrating MRBS with AI systems, including LLMs, autonomous agents, and AI-powered design tools.

### Goals

- Enable AI systems to understand and apply brand guidelines
- Provide consistent brand compliance across AI-generated content
- Optimize context usage and performance
- Support validation and quality assurance

---

## Loading Strategy

### Recommended Load Order

AI systems should load MRBS components in this order:

1. **Manifest** (`brand.manifest.json`) - Entry point, metadata
2. **Rules** (`rules/`) - Constraints, accessibility, legal requirements
3. **Visual tokens** (`visual/`) - Colors, typography, spacing, effects
4. **Identity** (`identity/`) - Voice, tone, messaging, values
5. **Templates** (`templates/`) - Presentation, document templates (if needed)

### Selective Loading

Load only what's needed for the current task:

| Task | Required Components | Optional Components |
|------|---------------------|---------------------|
| Writing copy | identity, rules | - |
| Creating presentation | visual, templates, rules | identity |
| Logo placement | assets, rules | visual |
| Full brand compliance | All | - |

### Example Loading Code

```python
from pathlib import Path
import json
import yaml

class MRBSLoader:
    def __init__(self, brand_path: Path):
        self.brand_path = Path(brand_path)
        self.manifest = self._load_manifest()

    def _load_manifest(self):
        with open(self.brand_path / 'brand.manifest.json') as f:
            return json.load(f)

    def load_for_task(self, task_type: str):
        """Load components based on task type"""
        components = {
            'writing': ['identity', 'rules'],
            'design': ['visual', 'rules', 'assets'],
            'presentation': ['visual', 'templates', 'rules'],
            'full': ['identity', 'visual', 'rules', 'assets', 'templates']
        }

        required = components.get(task_type, components['full'])
        return self._load_components(required)

    def _load_components(self, component_names):
        data = {'manifest': self.manifest}

        for component in component_names:
            if component == 'identity':
                data['identity'] = self._load_identity()
            elif component == 'visual':
                data['visual'] = self._load_visual()
            elif component == 'rules':
                data['rules'] = self._load_rules()
            elif component == 'assets':
                data['assets'] = self._load_assets()
            elif component == 'templates':
                data['templates'] = self._load_templates()

        return data

    def _load_visual(self):
        visual = {}
        visual_path = self.brand_path / 'visual'

        for token_file in visual_path.glob('*.tokens.json'):
            with open(token_file) as f:
                visual[token_file.stem] = json.load(f)

        return visual

    def _load_identity(self):
        identity = {}
        identity_path = self.brand_path / 'identity'

        for yaml_file in identity_path.glob('*.yaml'):
            with open(yaml_file) as f:
                identity[yaml_file.stem] = yaml.safe_load(f)

        return identity

    def _load_rules(self):
        rules = {}
        rules_path = self.brand_path / 'rules'

        for yaml_file in rules_path.glob('*.yaml'):
            with open(yaml_file) as f:
                rules[yaml_file.stem] = yaml.safe_load(f)

        return rules
```

---

## Prompt Engineering

### System Prompt Template

```markdown
# Brand Guidelines: {organization.name}

## Core Identity
- **Tagline**: {brand.tagline}
- **Mission**: {brand.mission}
- **Values**: {', '.join(brand.values)}

## Visual Identity
- **Primary color**: {color.brand.primary.$value}
- **Primary font (headings)**: {typography.font_family.heading.$value}
- **Primary font (body)**: {typography.font_family.body.$value}

## Voice & Tone
**Core attributes**: {', '.join(voice_tone.core_attributes)}

**Context-specific tones**:
{for context in voice_tone.tone_by_context:}
- **{context}**: {voice_tone.tone_by_context[context].characteristics}
{endfor}

## Key Rules
- {rules.constraints.primary_rules}
- Accessibility: WCAG {rules.accessibility.compliance_target.level}
- Legal: {rules.legal.required_disclaimers}

## Guidelines Location
Full guidelines: {manifest_path}
```

### Context Injection Examples

**For Content Generation:**
```python
def format_content_context(mrbs_data):
    """Format brand context for content generation"""

    identity = mrbs_data['identity']
    rules = mrbs_data['rules']

    context = f"""
You are writing content for {identity['brand-values']['organization']['name']}.

VOICE ATTRIBUTES:
{chr(10).join(f"- {attr}" for attr in identity['voice-tone']['voice']['core_attributes'])}

REQUIRED TERMINOLOGY:
- Use: {', '.join(identity['voice-tone']['terminology']['required_terms'])}
- Avoid: {', '.join(identity['voice-tone']['terminology']['avoid'])}

CONSTRAINTS:
{format_constraints(rules['constraints'])}

ACCESSIBILITY:
- Write at {rules['accessibility']['content']['reading_level']} reading level
- Use clear, concise language
"""
    return context
```

**For Visual Design:**
```python
def format_design_context(mrbs_data):
    """Format brand context for visual design"""

    visual = mrbs_data['visual']
    rules = mrbs_data['rules']

    colors = visual['colors']['color']['brand']
    typography = visual['typography']['typography']['font_family']

    context = f"""
BRAND COLORS:
- Primary: {colors['primary']['$value']} ({colors['primary'].get('description', '')})
- Usage: {', '.join(colors['primary']['usage']['recommended'])}
- Avoid: {', '.join(colors['primary']['usage']['prohibited'])}

TYPOGRAPHY:
- Headings: {typography['heading']['$value']}
- Body: {typography['body']['$value']}

SPACING:
Base unit: {visual['spacing']['spacing']['base_unit']['$value']}

CONSTRAINTS:
- Minimum contrast ratio: {rules['accessibility']['compliance_target']['min_contrast_ratio']}
- Color usage limits apply (see constraints)
"""
    return context
```

---

## Memory Systems

### For LLM Memory/Context Systems

```json
{
  "memory_key": "brand_guidelines_{organization_id}",
  "update_frequency": "on_change",
  "priority": "high",
  "content": {
    "always_remember": [
      "Tagline: {brand.tagline}",
      "Primary color: {color.brand.primary.$value}",
      "Core values: {brand.values}",
      "Voice tone: {voice-tone.core_attributes}"
    ],
    "retrieve_when": {
      "colors_mentioned": "Load: visual/colors.tokens.json",
      "writing_content": "Load: identity/voice-tone.yaml",
      "creating_presentation": "Load: templates/presentation/manifest.json",
      "accessibility_query": "Load: rules/accessibility.yaml"
    }
  }
}
```

### Semantic Retrieval Strategy

```python
def get_relevant_brand_context(query: str, mrbs_data: dict) -> str:
    """Retrieve relevant brand context based on query"""

    keywords_map = {
        'color': ['visual.colors'],
        'font': ['visual.typography'],
        'spacing': ['visual.spacing'],
        'tone': ['identity.voice-tone'],
        'values': ['identity.brand-values'],
        'logo': ['assets.logos'],
        'presentation': ['templates.presentation'],
        'accessibility': ['rules.accessibility'],
        'legal': ['rules.legal']
    }

    relevant_sections = []
    query_lower = query.lower()

    for keyword, sections in keywords_map.items():
        if keyword in query_lower:
            relevant_sections.extend(sections)

    # Load and format relevant sections
    context = []
    for section in relevant_sections:
        data = get_nested_data(mrbs_data, section)
        context.append(format_section(section, data))

    return '\n\n'.join(context)
```

---

## Validation Hooks

### Output Validation

```python
def validate_ai_output(output: dict, mrbs_data: dict) -> dict:
    """Validate AI-generated content against brand guidelines"""

    issues = []

    # Color validation
    if 'colors' in output:
        issues.extend(validate_colors(output['colors'], mrbs_data))

    # Typography validation
    if 'fonts' in output:
        issues.extend(validate_typography(output['fonts'], mrbs_data))

    # Content validation
    if 'text' in output:
        issues.extend(validate_content(output['text'], mrbs_data))

    return {
        'valid': len(issues) == 0,
        'issues': issues,
        'severity': max([i['severity'] for i in issues], default='none')
    }

def validate_colors(used_colors: list, mrbs_data: dict) -> list:
    """Validate colors against brand palette"""
    issues = []
    brand_colors = extract_all_colors(mrbs_data['visual']['colors'])

    for color in used_colors:
        if not is_brand_color(color, brand_colors):
            issues.append({
                'type': 'color',
                'severity': 'error',
                'message': f"Non-brand color used: {color}",
                'suggestion': find_closest_brand_color(color, brand_colors)
            })

    return issues

def validate_content(text: str, mrbs_data: dict) -> list:
    """Validate text content against voice/tone guidelines"""
    issues = []

    voice_tone = mrbs_data['identity']['voice-tone']

    # Check for prohibited terms
    if 'terminology' in voice_tone:
        for term in voice_tone['terminology'].get('avoid', []):
            if term.lower() in text.lower():
                issues.append({
                    'type': 'terminology',
                    'severity': 'warning',
                    'message': f"Avoid term used: '{term}'",
                    'suggestion': f"Consider using: {voice_tone['terminology'].get('required_terms', ['approved alternatives'])}"
                })

    return issues
```

---

## MCP Integration

### MRBS MCP Server

Model Context Protocol (MCP) servers can provide MRBS data to AI systems:

```typescript
// mrbs-mcp-server.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema
} from "@modelcontextprotocol/sdk/types.js";
import fs from "fs/promises";
import path from "path";
import yaml from "yaml";

interface MRBSServerConfig {
  brandPath: string;
  name: string;
}

export class MRBSServer {
  private server: Server;
  private brandPath: string;
  private brandName: string;

  constructor(config: MRBSServerConfig) {
    this.brandPath = config.brandPath;
    this.brandName = config.name;

    this.server = new Server(
      {
        name: `mrbs-${config.name}`,
        version: "1.0.0",
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    // List available resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
      resources: [
        {
          uri: `brand://${this.brandName}/manifest`,
          name: "Brand Manifest",
          mimeType: "application/json",
        },
        {
          uri: `brand://${this.brandName}/colors`,
          name: "Color Tokens",
          mimeType: "application/json",
        },
        {
          uri: `brand://${this.brandName}/typography`,
          name: "Typography Tokens",
          mimeType: "application/json",
        },
        {
          uri: `brand://${this.brandName}/voice-tone`,
          name: "Voice & Tone Guidelines",
          mimeType: "application/x-yaml",
        },
        {
          uri: `brand://${this.brandName}/constraints`,
          name: "Brand Constraints",
          mimeType: "application/x-yaml",
        },
        {
          uri: `brand://${this.brandName}/accessibility`,
          name: "Accessibility Requirements",
          mimeType: "application/x-yaml",
        },
      ],
    }));

    // Read resource
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const uri = request.params.uri;
      const resourcePath = this.uriToPath(uri);

      const content = await fs.readFile(resourcePath, "utf-8");

      return {
        contents: [{
          uri,
          mimeType: this.getMimeType(resourcePath),
          text: content,
        }],
      };
    });

    // List tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "validate_color",
          description: "Validate if a color is part of the brand palette",
          inputSchema: {
            type: "object",
            properties: {
              color: {
                type: "string",
                description: "Hex color code (e.g., #0066CC)",
              },
            },
            required: ["color"],
          },
        },
        {
          name: "get_brand_summary",
          description: "Get a summary of key brand elements",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
        {
          name: "check_accessibility",
          description: "Check color contrast ratio for accessibility",
          inputSchema: {
            type: "object",
            properties: {
              foreground: { type: "string" },
              background: { type: "string" },
            },
            required: ["foreground", "background"],
          },
        },
      ],
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case "validate_color":
          return await this.validateColor(args.color as string);

        case "get_brand_summary":
          return await this.getBrandSummary();

        case "check_accessibility":
          return await this.checkAccessibility(
            args.foreground as string,
            args.background as string
          );

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  private uriToPath(uri: string): string {
    const resourceMap: Record<string, string> = {
      manifest: "brand.manifest.json",
      colors: "visual/colors.tokens.json",
      typography: "visual/typography.tokens.json",
      "voice-tone": "identity/voice-tone.yaml",
      constraints: "rules/constraints.yaml",
      accessibility: "rules/accessibility.yaml",
    };

    const match = uri.match(/brand:\/\/[^/]+\/(.+)/);
    if (!match) throw new Error("Invalid URI");

    const resource = match[1];
    const filename = resourceMap[resource];
    if (!filename) throw new Error("Unknown resource");

    return path.join(this.brandPath, filename);
  }

  private getMimeType(filepath: string): string {
    if (filepath.endsWith(".json")) return "application/json";
    if (filepath.endsWith(".yaml")) return "application/x-yaml";
    return "text/plain";
  }

  private async validateColor(color: string) {
    const colorsPath = path.join(this.brandPath, "visual/colors.tokens.json");
    const colors = JSON.parse(await fs.readFile(colorsPath, "utf-8"));

    const isValid = this.findColor(colors.color, color);

    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          valid: isValid,
          color: color,
          message: isValid
            ? "Color is part of brand palette"
            : "Color not found in brand palette",
        }, null, 2),
      }],
    };
  }

  private findColor(obj: any, targetColor: string): boolean {
    for (const key in obj) {
      const value = obj[key];
      if (typeof value === "object") {
        if (value.$value === targetColor) return true;
        if (this.findColor(value, targetColor)) return true;
      }
    }
    return false;
  }

  private async getBrandSummary() {
    const manifest = JSON.parse(
      await fs.readFile(
        path.join(this.brandPath, "brand.manifest.json"),
        "utf-8"
      )
    );

    const colors = JSON.parse(
      await fs.readFile(
        path.join(this.brandPath, "visual/colors.tokens.json"),
        "utf-8"
      )
    );

    const summary = {
      organization: manifest.organization.name,
      tagline: manifest.brand.tagline,
      primary_color: colors.color.brand.primary.$value,
      updated: manifest.updated,
    };

    return {
      content: [{
        type: "text",
        text: JSON.stringify(summary, null, 2),
      }],
    };
  }

  private async checkAccessibility(foreground: string, background: string) {
    // Simplified contrast calculation
    const ratio = this.calculateContrastRatio(foreground, background);

    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          foreground,
          background,
          ratio: ratio.toFixed(2),
          passes_aa_normal: ratio >= 4.5,
          passes_aa_large: ratio >= 3.0,
          passes_aaa_normal: ratio >= 7.0,
          passes_aaa_large: ratio >= 4.5,
        }, null, 2),
      }],
    };
  }

  private calculateContrastRatio(fg: string, bg: string): number {
    // Simplified implementation - use proper library in production
    const l1 = this.getLuminance(fg);
    const l2 = this.getLuminance(bg);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  private getLuminance(hex: string): number {
    // Simplified - use proper calculation in production
    const rgb = parseInt(hex.slice(1), 16);
    return ((rgb >> 16) & 0xff) / 255;
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}
```

---

## Best Practices

### 1. Load Incrementally

Don't load the entire MRBS into context unnecessarily:

```python
# Good
brand_context = loader.load_for_task('writing')

# Avoid (unless needed)
brand_context = loader.load_for_task('full')
```

### 2. Cache Resolved Tokens

Resolve token references once and cache:

```python
class TokenResolver:
    def __init__(self, mrbs_data):
        self.mrbs_data = mrbs_data
        self.cache = {}

    def resolve(self, reference: str):
        if reference in self.cache:
            return self.cache[reference]

        resolved = self._resolve_reference(reference)
        self.cache[reference] = resolved
        return resolved
```

### 3. Validate Early

Validate AI outputs before delivering to users:

```python
# Generate content
output = ai_model.generate(prompt, brand_context)

# Validate
validation = validate_ai_output(output, mrbs_data)

if not validation['valid']:
    # Fix or regenerate
    output = fix_issues(output, validation['issues'])
```

### 4. Provide Context Hierarchy

Give AI priority guidance:

```python
context = f"""
CRITICAL RULES (must follow):
{format_rules(mrbs_data['rules']['constraints']['must'])}

RECOMMENDATIONS (should follow):
{format_rules(mrbs_data['rules']['constraints']['should'])}

GUIDELINES (may deviate with reason):
{format_rules(mrbs_data['rules']['constraints']['may'])}
"""
```

### 5. Use Structured Outputs

Request structured outputs for easier validation:

```python
prompt = f"""
Generate a presentation slide following the brand guidelines.

Return JSON:
{{
  "title": "...",
  "content": ["..."],
  "colors_used": ["#hex"],
  "fonts_used": ["font name"]
}}

Brand guidelines:
{brand_context}
"""
```

---

## Conclusion

Proper MRBS integration enables AI systems to consistently apply brand guidelines while maintaining flexibility and performance. Follow these patterns for optimal results.

For questions or suggestions, open an issue at the [MRBS repository](https://github.com/MRBSystem/MRBS-Specification).
