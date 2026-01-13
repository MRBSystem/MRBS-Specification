# CLAUDE.md — Claude Code Instructions

This file contains instructions for Claude Code (and other AI agents) working with this repository.

## Repository Overview

MRBS (Machine-Readable Brand System) is an open specification for AI-ready brand identity systems. The repo contains:

- `/specification` — The formal specification documents and JSON schemas
- `/example` — A complete, neutral reference implementation
- `/tools` — Validators and converters (planned)
- `/docs` — User documentation and guides

## Working with This Repository

### When Editing the Specification

1. **Schema changes require spec updates**: If you modify any `.schema.json` file, also update the corresponding section in `specification/v1.0/SPEC.md`

2. **Version tracking**: 
   - Patch changes (typos, clarifications): Update `CHANGELOG.md` under `[Unreleased]`
   - Minor changes (new optional fields): Bump minor version in spec header
   - Major changes (breaking): Requires RFC process — do not make without explicit approval

3. **Backward compatibility**: New fields should be optional. Never remove or rename existing required fields in a minor version.

### When Editing the Example

1. **Keep examples neutral**: No real company names, products, or identifying information. Use generic terms like "Acme Corporation" or placeholder values.

2. **Maintain consistency**: If you change a token value in one file, check if it's referenced elsewhere:
   - `colors.tokens.json` values are referenced in `constraints.yaml`, `accessibility.yaml`, and template manifests
   - Font names in `typography.tokens.json` should match `voice-tone.yaml` references

3. **Validate JSON/YAML**: Before committing, ensure all JSON and YAML files are syntactically valid:
   ```bash
   # Validate JSON
   python -m json.tool example/brand.manifest.json > /dev/null
   
   # Validate YAML
   python -c "import yaml; yaml.safe_load(open('example/identity/voice-tone.yaml'))"
   ```

4. **Test token references**: Ensure all `{reference.paths}` resolve to actual tokens.

### File Format Conventions

**JSON Files:**
- 2-space indentation
- No trailing commas
- Use `$` prefix for meta-fields (`$schema`, `$value`, `$type`)
- Keys in `snake_case`

**YAML Files:**
- 2-space indentation
- Quote strings with special characters
- Use comments for non-obvious fields
- Group related fields under clear hierarchy

**Markdown:**
- One sentence per line (better diffs)
- Use reference-style links for repeated URLs
- Code blocks must specify language

### Common Tasks

#### Adding a New Token Type

1. Create schema in `specification/v1.0/schema/[type].tokens.schema.json`
2. Document in `specification/v1.0/SPEC.md` under appropriate section
3. Add example in `example/visual/[type].tokens.json`
4. Update `example/brand.manifest.json` if new component type
5. Add to `CHANGELOG.md`

#### Adding a New Template Type

1. Create manifest schema if needed
2. Add template manifest in `example/templates/[type]/manifest.json`
3. Document template zones and constraints
4. Add usage examples in docs

#### Fixing a Bug or Typo

1. Make the fix
2. Add entry to `CHANGELOG.md` under `[Unreleased]` → `Fixed`
3. If spec clarification, note which section was clarified

### Testing

Before submitting changes:

```bash
# 1. Validate all JSON files
find . -name "*.json" -exec python -m json.tool {} > /dev/null \;

# 2. Validate all YAML files  
find . -name "*.yaml" -exec python -c "import yaml; yaml.safe_load(open('{}'))" \;

# 3. Check for broken internal links in markdown
# (manual review or use markdown link checker)

# 4. Ensure example validates against schemas
# (when validator tool is available)
npm run validate:example
```

### Do Not

- **Do not** add real company brand assets or proprietary information
- **Do not** make breaking changes without RFC process
- **Do not** add dependencies without discussion
- **Do not** commit large binary files (logos, images) — use placeholders or external references
- **Do not** include environment-specific paths or credentials

### AI Agent Integration Notes

When an AI agent needs to use MRBS:

1. **Entry point**: Always start by reading `brand.manifest.json`
2. **Priority order**: Follow `ai_instructions.priority_order` for conflict resolution
3. **Validation**: If `ai_instructions.validation_required` is true, validate output against rules before delivery
4. **References**: Resolve token references like `{color.brand.primary}` to actual values

Example agent workflow:
```
1. Read brand.manifest.json
2. Load components based on task (e.g., visual + templates for presentations)
3. Extract relevant constraints from rules/
4. Generate content following guidelines
5. Validate against constraints if required
6. Deliver output
```

## Questions?

- Open an issue for spec clarifications
- Start a discussion for feature ideas
- Tag maintainers for urgent issues
