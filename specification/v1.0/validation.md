# MRBS Validation Framework

**Machine-Readable Brand System - Validation and Testing Guide**

Version: 1.0
Status: Final
Updated: 2025-01-19

---

## Overview

This document defines validation requirements and testing methodologies for MRBS implementations to ensure correctness, completeness, and brand compliance.

---

## Automated Validation

### 1. File Structure Validation

**Validate directory structure and required files:**

```python
def validate_structure(mrbs_path: Path) -> dict:
    """Validate MRBS directory structure"""

    required_files = [
        'brand.manifest.json',
        'identity/brand-values.yaml',
        'identity/voice-tone.yaml',
        'visual/colors.tokens.json',
        'visual/typography.tokens.json',
        'rules/constraints.yaml',
        'rules/accessibility.yaml'
    ]

    optional_files = [
        'visual/spacing.tokens.json',
        'visual/effects.tokens.json',
        'rules/legal.yaml',
        'templates/presentation/manifest.json',
        'assets/logos/manifest.json'
    ]

    results = {
        'valid': True,
        'missing_required': [],
        'missing_optional': [],
        'conformance_level': None
    }

    # Check required files
    for file_path in required_files:
        full_path = mrbs_path / file_path
        if not full_path.exists():
            results['missing_required'].append(file_path)
            results['valid'] = False

    # Check optional files
    for file_path in optional_files:
        full_path = mrbs_path / file_path
        if not full_path.exists():
            results['missing_optional'].append(file_path)

    # Determine conformance level
    if results['valid']:
        if len(results['missing_optional']) == 0:
            results['conformance_level'] = 'MRBS Complete'
        else:
            results['conformance_level'] = 'MRBS Standard'
    else:
        results['conformance_level'] = 'Non-conformant'

    return results
```

### 2. Schema Validation

**Validate JSON files against schemas:**

```python
import jsonschema
import json
from pathlib import Path

def validate_json_schema(file_path: Path, schema_path: Path) -> dict:
    """Validate JSON file against JSON Schema"""

    try:
        with open(file_path) as f:
            data = json.load(f)

        with open(schema_path) as f:
            schema = json.load(f)

        jsonschema.validate(data, schema)

        return {
            'valid': True,
            'file': str(file_path),
            'errors': []
        }

    except json.JSONDecodeError as e:
        return {
            'valid': False,
            'file': str(file_path),
            'errors': [f"Invalid JSON: {str(e)}"]
        }

    except jsonschema.ValidationError as e:
        return {
            'valid': False,
            'file': str(file_path),
            'errors': [str(e)]
        }

def validate_all_schemas(mrbs_path: Path, schema_path: Path) -> dict:
    """Validate all token files against their schemas"""

    validations = []

    # Map files to schemas
    file_schema_map = {
        'brand.manifest.json': 'brand.manifest.schema.json',
        'visual/colors.tokens.json': 'colors.tokens.schema.json',
        'visual/typography.tokens.json': 'typography.tokens.schema.json',
        'visual/spacing.tokens.json': 'spacing.tokens.schema.json',
        'visual/effects.tokens.json': 'effects.tokens.schema.json'
    }

    for file_rel, schema_file in file_schema_map.items():
        file_path = mrbs_path / file_rel
        schema_file_path = schema_path / schema_file

        if file_path.exists() and schema_file_path.exists():
            result = validate_json_schema(file_path, schema_file_path)
            validations.append(result)

    all_valid = all(v['valid'] for v in validations)

    return {
        'valid': all_valid,
        'validations': validations,
        'total': len(validations),
        'passed': sum(1 for v in validations if v['valid']),
        'failed': sum(1 for v in validations if not v['valid'])
    }
```

### 3. Token Reference Validation

**Validate all token references resolve:**

```python
def validate_token_references(mrbs_path: Path) -> dict:
    """Validate all token references resolve to actual tokens"""

    # Load all tokens
    all_tokens = load_all_tokens(mrbs_path)

    # Find all references
    references = find_all_references(mrbs_path)

    unresolved = []
    circular = []

    for ref in references:
        if not resolve_token(ref['path'], all_tokens):
            unresolved.append(ref)

        if is_circular_reference(ref['path'], all_tokens):
            circular.append(ref)

    return {
        'valid': len(unresolved) == 0 and len(circular) == 0,
        'total_references': len(references),
        'unresolved': unresolved,
        'circular': circular
    }

def resolve_token(reference: str, tokens: dict) -> any:
    """Resolve a token reference to its value"""

    # Remove curly braces
    path = reference.strip('{}')

    # Split path
    parts = path.split('.')

    # Traverse token tree
    current = tokens
    for part in parts:
        if isinstance(current, dict) and part in current:
            current = current[part]
        else:
            return None  # Unresolved

    # Check if this is a token with $value
    if isinstance(current, dict) and '$value' in current:
        value = current['$value']

        # If value is also a reference, resolve recursively
        if isinstance(value, str) and value.startswith('{'):
            return resolve_token(value, tokens)

        return value

    return current

def is_circular_reference(reference: str, tokens: dict, visited=None) -> bool:
    """Detect circular token references"""

    if visited is None:
        visited = set()

    if reference in visited:
        return True  # Circular!

    visited.add(reference)

    # Resolve one level
    value = resolve_token(reference, tokens)

    # If value is a reference, check recursively
    if isinstance(value, str) and value.startswith('{'):
        return is_circular_reference(value, tokens, visited)

    return False
```

### 4. Color Contrast Validation

**Validate color combinations meet WCAG:**

```python
def calculate_luminance(hex_color: str) -> float:
    """Calculate relative luminance of a color"""

    # Remove #
    hex_color = hex_color.lstrip('#')

    # Convert to RGB
    r = int(hex_color[0:2], 16) / 255
    g = int(hex_color[2:4], 16) / 255
    b = int(hex_color[4:6], 16) / 255

    # Apply gamma correction
    def adjust(channel):
        if channel <= 0.03928:
            return channel / 12.92
        return ((channel + 0.055) / 1.055) ** 2.4

    r = adjust(r)
    g = adjust(g)
    b = adjust(b)

    # Calculate luminance
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

def calculate_contrast_ratio(fg: str, bg: str) -> float:
    """Calculate WCAG contrast ratio between two colors"""

    l1 = calculate_luminance(fg)
    l2 = calculate_luminance(bg)

    lighter = max(l1, l2)
    darker = min(l1, l2)

    return (lighter + 0.05) / (darker + 0.05)

def validate_color_accessibility(mrbs_data: dict) -> dict:
    """Validate all required color combinations"""

    colors = mrbs_data['visual']['colors']
    accessibility_rules = mrbs_data['rules']['accessibility']

    required_tests = accessibility_rules.get('required_combinations', [])

    failures = []

    for test in required_tests:
        fg = resolve_color(test['foreground'], colors)
        bg = resolve_color(test['background'], colors)

        ratio = calculate_contrast_ratio(fg, bg)
        min_ratio = test.get('min_ratio', 4.5)

        if ratio < min_ratio:
            failures.append({
                'description': test['description'],
                'foreground': fg,
                'background': bg,
                'ratio': round(ratio, 2),
                'required': min_ratio,
                'passes_aa': ratio >= 4.5,
                'passes_aaa': ratio >= 7.0
            })

    return {
        'valid': len(failures) == 0,
        'total_tests': len(required_tests),
        'failures': failures
    }
```

---

## CLI Validator Tool

### Implementation

```python
#!/usr/bin/env python3
"""MRBS Validator - Command-line tool"""

import click
from pathlib import Path
import json

@click.command()
@click.argument('mrbs_path', type=click.Path(exists=True))
@click.option('--schema-path', default='./specification/v1.0/schema', help='Path to schema files')
@click.option('--strict', is_flag=True, help='Fail on warnings')
@click.option('--json-output', is_flag=True, help='Output JSON instead of text')
def validate(mrbs_path, schema_path, strict, json_output):
    """Validate an MRBS brand system"""

    mrbs_path = Path(mrbs_path)
    schema_path = Path(schema_path)

    results = {
        'structure': validate_structure(mrbs_path),
        'schemas': validate_all_schemas(mrbs_path, schema_path),
        'references': validate_token_references(mrbs_path),
        'accessibility': validate_color_accessibility(load_mrbs(mrbs_path))
    }

    # Determine overall validity
    all_valid = all([
        results['structure']['valid'],
        results['schemas']['valid'],
        results['references']['valid'],
        results['accessibility']['valid']
    ])

    if json_output:
        click.echo(json.dumps(results, indent=2))
    else:
        print_text_report(results)

    exit_code = 0 if all_valid else 1
    exit(exit_code)

def print_text_report(results):
    """Print human-readable validation report"""

    click.echo("=" * 60)
    click.echo("MRBS Validation Report")
    click.echo("=" * 60)

    # Structure
    click.echo("\n📁 File Structure")
    if results['structure']['valid']:
        click.echo("  ✓ All required files present")
        click.echo(f"  Conformance Level: {results['structure']['conformance_level']}")
    else:
        click.echo("  ✗ Missing required files:")
        for file in results['structure']['missing_required']:
            click.echo(f"    - {file}")

    # Schemas
    click.echo("\n📋 Schema Validation")
    if results['schemas']['valid']:
        click.echo(f"  ✓ All schemas valid ({results['schemas']['passed']}/{results['schemas']['total']})")
    else:
        click.echo(f"  ✗ Schema errors ({results['schemas']['failed']} failures)")
        for validation in results['schemas']['validations']:
            if not validation['valid']:
                click.echo(f"    - {validation['file']}")
                for error in validation['errors']:
                    click.echo(f"      {error}")

    # References
    click.echo("\n🔗 Token References")
    if results['references']['valid']:
        click.echo(f"  ✓ All references valid ({results['references']['total_references']} checked)")
    else:
        if results['references']['unresolved']:
            click.echo("  ✗ Unresolved references:")
            for ref in results['references']['unresolved']:
                click.echo(f"    - {ref['path']} in {ref['file']}")

        if results['references']['circular']:
            click.echo("  ✗ Circular references:")
            for ref in results['references']['circular']:
                click.echo(f"    - {ref['path']}")

    # Accessibility
    click.echo("\n♿ Accessibility")
    if results['accessibility']['valid']:
        click.echo(f"  ✓ All color contrasts pass ({results['accessibility']['total_tests']} combinations)")
    else:
        click.echo("  ✗ Accessibility failures:")
        for failure in results['accessibility']['failures']:
            click.echo(f"    - {failure['description']}")
            click.echo(f"      {failure['foreground']} on {failure['background']}")
            click.echo(f"      Ratio: {failure['ratio']} (required: {failure['required']})")

    click.echo("\n" + "=" * 60)
    overall = "✓ PASSED" if all([
        results['structure']['valid'],
        results['schemas']['valid'],
        results['references']['valid'],
        results['accessibility']['valid']
    ]) else "✗ FAILED"
    click.echo(f"Overall: {overall}")
    click.echo("=" * 60)

if __name__ == '__main__':
    validate()
```

### Usage

```bash
# Validate MRBS
python validate.py /path/to/brand-system

# Strict mode (fail on warnings)
python validate.py /path/to/brand-system --strict

# JSON output (for CI)
python validate.py /path/to/brand-system --json-output
```

---

## Continuous Integration

### Pre-commit Hook

```bash
#!/bin/bash
# .git/hooks/pre-commit

echo "Running MRBS validation..."
python tools/validator.py . --strict

if [ $? -ne 0 ]; then
    echo "❌ MRBS validation failed. Fix errors before committing."
    exit 1
fi

echo "✅ MRBS validation passed"
```

### GitHub Actions Workflow

```yaml
# .github/workflows/mrbs-validation.yml
name: MRBS Validation

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  validate:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: |
          pip install jsonschema click pyyaml

      - name: Validate MRBS structure
        run: python tools/validator.py . --json-output > validation-results.json

      - name: Upload validation results
        uses: actions/upload-artifact@v3
        with:
          name: validation-results
          path: validation-results.json

      - name: Check validation status
        run: |
          if ! python tools/validator.py . --strict; then
            echo "::error::MRBS validation failed"
            exit 1
          fi
```

---

## Manual Testing

### Content Creation Test

1. Create sample content following MRBS guidelines
2. Have team member unfamiliar with brand review
3. Check adherence to:
   - Color usage
   - Typography
   - Voice/tone
   - Legal requirements
   - Accessibility

### AI System Test

1. Provide MRBS to AI system
2. Request sample outputs (presentation, document, copy)
3. Validate outputs against brand guidelines
4. Measure:
   - Accuracy of brand application
   - Consistency across outputs
   - Time to generate vs manual
   - Quality rating (1-5 scale)

### User Acceptance Test

1. Brief non-brand-team members on brand
2. Have them create content using MRBS
3. Collect feedback on:
   - Ease of use
   - Clarity of guidelines
   - Completeness
   - Gaps or confusions

---

## Best Practices

1. **Validate early and often** - Run validation before every commit
2. **Automate in CI/CD** - Catch errors before merge
3. **Test with real content** - Create actual deliverables to validate guidelines
4. **Involve users** - Get feedback from people who will use the brand system
5. **Document known issues** - Track limitations and planned improvements

---

## Conclusion

Regular validation ensures MRBS implementations remain correct, complete, and usable. Combine automated and manual testing for comprehensive coverage.

For questions, open an issue at the [MRBS repository](https://github.com/MRBSystem/MRBS-Specification).
