# AI Integration Patterns

This guide explains how to integrate MRBS brand systems with various AI platforms.

## Overview

MRBS is designed to be consumed by AI agents. This document covers:

1. [System Prompt Integration](#system-prompt-integration)
2. [MCP Server Integration](#mcp-server-integration)
3. [REST API Integration](#rest-api-integration)
4. [Direct File Access](#direct-file-access)
5. [Platform-Specific Guides](#platform-specific-guides)

---

## System Prompt Integration

The simplest integration method is including brand context in AI system prompts.

### Minimal Integration

```markdown
## Brand Guidelines

Follow these brand rules:
- Primary color: #0066CC (use for headings, buttons)
- Font: Inter for headings, Source Sans Pro for body
- Voice: Professional but approachable
- Max 6 bullets per slide, 15 words per bullet
```

### Full Context Integration

```markdown
## Brand Context

This conversation follows MRBS brand guidelines.

### Visual Identity
- **Primary**: #0066CC — headings, CTAs, links (not body text)
- **Secondary**: #FF6B35 — accents only, ≤15% of design
- **Text**: #212121 on white backgrounds
- **Headings**: Inter (600, 700)
- **Body**: Source Sans Pro (400, 600)

### Voice
- Professional but approachable
- Confident without arrogance
- Use contractions in conversational contexts only
- Avoid: synergy, leverage, disrupt, revolutionary

### Presentations
- Max 6 bullets per slide
- Max 15 words per bullet
- One idea per slide
- Cite sources for external data

### Documents
- H1 → H2 → H3 hierarchy (never skip)
- 3-5 sentences per paragraph
- Left-align body text

### Validation
Before delivering:
✓ Colors match brand palette
✓ Fonts are brand fonts
✓ Content limits respected
✓ Voice matches context
```

### Dynamic System Prompt Builder

```python
def build_brand_prompt(manifest_path, context="general"):
    """Build a system prompt from MRBS brand system."""
    import json
    import yaml
    
    with open(manifest_path) as f:
        manifest = json.load(f)
    
    base_path = os.path.dirname(manifest_path)
    
    # Load components
    colors = load_json(f"{base_path}/{manifest['components']['visual']}/colors.tokens.json")
    typography = load_json(f"{base_path}/{manifest['components']['visual']}/typography.tokens.json")
    voice = load_yaml(f"{base_path}/{manifest['components']['identity']}/voice-tone.yaml")
    rules = load_yaml(f"{base_path}/{manifest['components']['rules']}/constraints.yaml")
    
    prompt = f"""## Brand Guidelines: {manifest['brand']['name']}

### Colors
- Primary: {colors['color']['brand']['primary']['$value']}
- Usage: {', '.join(colors['color']['brand']['primary']['usage']['recommended'])}

### Typography  
- Headings: {typography['typography']['font_family']['heading']['$value']}
- Body: {typography['typography']['font_family']['body']['$value']}

### Voice ({context})
{format_voice_for_context(voice, context)}

### Key Rules
{format_rules(rules)}
"""
    return prompt
```

---

## MCP Server Integration

[Model Context Protocol](https://modelcontextprotocol.io) provides structured access to brand guidelines.

### MCP Server Implementation

```typescript
// brand-mcp-server.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server({
  name: "brand-guidelines",
  version: "1.0.0"
}, {
  capabilities: {
    resources: {},
    tools: {}
  }
});

// Resources
server.setRequestHandler("resources/list", async () => ({
  resources: [
    { uri: "brand://manifest", name: "Brand Manifest" },
    { uri: "brand://colors", name: "Color Tokens" },
    { uri: "brand://typography", name: "Typography Tokens" },
    { uri: "brand://voice/formal", name: "Formal Voice Guidelines" },
    { uri: "brand://voice/conversational", name: "Conversational Voice" },
    { uri: "brand://rules", name: "Brand Rules" },
    { uri: "brand://templates/presentation", name: "Presentation Templates" }
  ]
}));

server.setRequestHandler("resources/read", async (request) => {
  const { uri } = request.params;
  
  switch (uri) {
    case "brand://colors":
      return { contents: [{ 
        uri, 
        mimeType: "application/json",
        text: JSON.stringify(loadColors())
      }]};
    case "brand://voice/formal":
      return { contents: [{
        uri,
        mimeType: "text/yaml", 
        text: formatVoiceGuidelines("formal")
      }]};
    // ... other resources
  }
});

// Tools
server.setRequestHandler("tools/list", async () => ({
  tools: [
    {
      name: "validate_content",
      description: "Validate content against brand guidelines",
      inputSchema: {
        type: "object",
        properties: {
          content_type: { type: "string", enum: ["presentation", "document", "email"] },
          colors_used: { type: "array", items: { type: "string" } },
          fonts_used: { type: "array", items: { type: "string" } },
          text_content: { type: "string" }
        }
      }
    },
    {
      name: "check_contrast",
      description: "Check color contrast ratio",
      inputSchema: {
        type: "object",
        properties: {
          foreground: { type: "string" },
          background: { type: "string" }
        },
        required: ["foreground", "background"]
      }
    }
  ]
}));

server.setRequestHandler("tools/call", async (request) => {
  const { name, arguments: args } = request.params;
  
  if (name === "check_contrast") {
    const ratio = calculateContrast(args.foreground, args.background);
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          ratio: ratio.toFixed(2),
          passes_aa: ratio >= 4.5,
          passes_aaa: ratio >= 7
        })
      }]
    };
  }
  // ... other tools
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

### Claude Desktop Configuration

```json
{
  "mcpServers": {
    "brand": {
      "command": "node",
      "args": ["/path/to/brand-mcp-server.js"],
      "env": {
        "BRAND_PATH": "/path/to/brand-system"
      }
    }
  }
}
```

---

## REST API Integration

For enterprise deployments, expose MRBS via REST API.

### OpenAPI Specification

```yaml
openapi: 3.0.0
info:
  title: MRBS Brand API
  version: 1.0.0
  
paths:
  /brand/manifest:
    get:
      summary: Get brand manifest
      responses:
        200:
          description: Brand manifest
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Manifest'
                
  /brand/colors:
    get:
      summary: Get color tokens
      responses:
        200:
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ColorTokens'
                
  /brand/voice/{context}:
    get:
      summary: Get voice guidelines for context
      parameters:
        - name: context
          in: path
          required: true
          schema:
            type: string
            enum: [formal, professional, conversational]
      responses:
        200:
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/VoiceGuidelines'
                
  /brand/validate:
    post:
      summary: Validate content against brand rules
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                content_type:
                  type: string
                colors_used:
                  type: array
                  items:
                    type: string
                fonts_used:
                  type: array
                  items:
                    type: string
                text_content:
                  type: string
      responses:
        200:
          content:
            application/json:
              schema:
                type: object
                properties:
                  valid:
                    type: boolean
                  violations:
                    type: array
                    items:
                      type: object
                      properties:
                        rule:
                          type: string
                        message:
                          type: string
                        severity:
                          type: string
```

### Express Implementation

```javascript
const express = require('express');
const app = express();

// Load brand system
const brandSystem = loadBrandSystem('./brand-system');

app.get('/brand/manifest', (req, res) => {
  res.json(brandSystem.manifest);
});

app.get('/brand/colors', (req, res) => {
  res.json(brandSystem.colors);
});

app.get('/brand/voice/:context', (req, res) => {
  const { context } = req.params;
  const voice = brandSystem.voice.tone_by_context[context];
  if (!voice) {
    return res.status(404).json({ error: 'Context not found' });
  }
  res.json(voice);
});

app.post('/brand/validate', (req, res) => {
  const { content_type, colors_used, fonts_used, text_content } = req.body;
  const violations = validateContent(brandSystem, req.body);
  res.json({
    valid: violations.length === 0,
    violations
  });
});

app.listen(3000);
```

---

## Direct File Access

For AI agents with file system access, read MRBS files directly.

### Workflow

```
1. Read brand.manifest.json
2. Parse component paths
3. Load relevant components based on task
4. Apply guidelines during generation
5. Validate output if required
```

### Example: Claude with Computer Use

```
User: Create a presentation following the brand in ./brand-system/

Claude's approach:
1. view ./brand-system/brand.manifest.json
2. view ./brand-system/visual/colors.tokens.json
3. view ./brand-system/templates/presentation/manifest.json
4. view ./brand-system/rules/constraints.yaml
5. Create presentation following loaded guidelines
```

---

## Platform-Specific Guides

### Claude (Anthropic)

**Via System Prompt:**
```
Include condensed brand guidelines in system prompt.
Reference: "Follow the brand guidelines provided above."
```

**Via MCP:**
```
Configure MCP server in Claude Desktop.
Access via: "Use the brand guidelines from the brand server."
```

### ChatGPT (OpenAI)

**Custom GPT:**
1. Upload MRBS files to Knowledge
2. Add instructions: "Always reference the uploaded brand guidelines"
3. Include key rules in system instructions

**API:**
```python
messages = [
    {"role": "system", "content": brand_system_prompt},
    {"role": "user", "content": user_request}
]
```

### Other Platforms

The MRBS format is platform-agnostic. Any AI system can:
1. Parse JSON/YAML files
2. Extract relevant rules
3. Apply during generation

---

## Best Practices

### 1. Load Only What's Needed

Don't load entire brand system for simple tasks:
- Presentation → colors, typography, presentation template, constraints
- Email → colors, email template, voice-tone
- Document → typography, document template, voice-tone

### 2. Cache Guidelines

Brand guidelines change infrequently. Cache loaded guidelines.

### 3. Validate Before Delivery

If `ai_instructions.validation_required` is true:
```
1. Generate content
2. Check against rules
3. Fix violations
4. Deliver
```

### 4. Handle Conflicts

When rules conflict, follow `ai_instructions.priority_order`:
```json
"priority_order": ["rules", "visual", "templates", "identity"]
```

Rules take precedence over visual tokens, etc.

### 5. Fallback Gracefully

If `ai_instructions.fallback_behavior` is "conservative":
- When uncertain, choose the safer option
- Ask for clarification on ambiguous requirements
- Default to formal tone when context is unclear
