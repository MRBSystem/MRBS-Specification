#!/usr/bin/env node

/**
 * MRBS Validator
 * Validates an MRBS brand system for compliance
 * 
 * Usage: node validate.js /path/to/brand-system
 */

const fs = require('fs');
const path = require('path');

class MRBSValidator {
  constructor(brandPath) {
    this.brandPath = brandPath;
    this.errors = [];
    this.warnings = [];
  }

  validate() {
    console.log(`\nValidating MRBS brand system at: ${this.brandPath}\n`);

    // Check manifest exists
    if (!this.checkManifest()) {
      return this.report();
    }

    // Load manifest
    const manifest = this.loadJSON('brand.manifest.json');
    
    // Validate manifest structure
    this.validateManifest(manifest);

    // Check component paths
    this.validateComponents(manifest.components || {});

    // Validate visual tokens if present
    if (manifest.components?.visual) {
      this.validateVisualTokens(manifest.components.visual);
    }

    // Validate rules if present
    if (manifest.components?.rules) {
      this.validateRules(manifest.components.rules);
    }

    return this.report();
  }

  checkManifest() {
    const manifestPath = path.join(this.brandPath, 'brand.manifest.json');
    if (!fs.existsSync(manifestPath)) {
      this.errors.push('brand.manifest.json not found at root');
      return false;
    }
    return true;
  }

  loadJSON(filePath) {
    try {
      const fullPath = path.join(this.brandPath, filePath);
      return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    } catch (e) {
      this.errors.push(`Failed to parse ${filePath}: ${e.message}`);
      return null;
    }
  }

  validateManifest(manifest) {
    if (!manifest) return;

    // Required fields
    if (!manifest.mrbs_version) {
      this.errors.push('Manifest missing required field: mrbs_version');
    }
    if (!manifest.brand?.name) {
      this.errors.push('Manifest missing required field: brand.name');
    }
    if (!manifest.components) {
      this.errors.push('Manifest missing required field: components');
    }

    // Version format
    if (manifest.mrbs_version && !/^\d+\.\d+\.\d+$/.test(manifest.mrbs_version)) {
      this.warnings.push('mrbs_version should follow semver format (e.g., 1.0.0)');
    }

    console.log(`  ✓ Manifest structure valid`);
  }

  validateComponents(components) {
    for (const [name, componentPath] of Object.entries(components)) {
      const fullPath = path.join(this.brandPath, componentPath);
      
      if (!fs.existsSync(fullPath)) {
        this.errors.push(`Component path does not exist: ${componentPath}`);
      } else {
        console.log(`  ✓ Component "${name}" found at ${componentPath}`);
      }
    }
  }

  validateVisualTokens(visualPath) {
    const colorsFile = path.join(visualPath, 'colors.tokens.json');
    const fullPath = path.join(this.brandPath, colorsFile);
    
    if (fs.existsSync(fullPath)) {
      const colors = this.loadJSON(colorsFile);
      if (colors) {
        this.validateColors(colors);
      }
    }
  }

  validateColors(colors) {
    const colorRegex = /^#[0-9A-Fa-f]{6}$/;
    let validCount = 0;
    let invalidCount = 0;

    const checkColor = (obj, path = '') => {
      for (const [key, value] of Object.entries(obj)) {
        if (key === '$value' && typeof value === 'string') {
          if (value.startsWith('#')) {
            if (colorRegex.test(value)) {
              validCount++;
            } else {
              this.warnings.push(`Invalid hex color at ${path}: ${value}`);
              invalidCount++;
            }
          } else if (value.startsWith('{')) {
            // Token reference - ok
            validCount++;
          }
        } else if (typeof value === 'object' && value !== null) {
          checkColor(value, `${path}.${key}`);
        }
      }
    };

    checkColor(colors);
    console.log(`  ✓ Colors validated: ${validCount} valid, ${invalidCount} invalid`);
  }

  validateRules(rulesPath) {
    const constraintsFile = path.join(rulesPath, 'constraints.yaml');
    const fullPath = path.join(this.brandPath, constraintsFile);
    
    if (fs.existsSync(fullPath)) {
      console.log(`  ✓ Constraints file found`);
    } else {
      this.warnings.push('constraints.yaml not found in rules directory');
    }
  }

  report() {
    console.log('\n' + '='.repeat(50));
    console.log('VALIDATION REPORT');
    console.log('='.repeat(50));

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('\n✅ Brand system is valid!\n');
      return true;
    }

    if (this.errors.length > 0) {
      console.log(`\n❌ ERRORS (${this.errors.length}):`);
      this.errors.forEach(e => console.log(`   • ${e}`));
    }

    if (this.warnings.length > 0) {
      console.log(`\n⚠️  WARNINGS (${this.warnings.length}):`);
      this.warnings.forEach(w => console.log(`   • ${w}`));
    }

    console.log('');
    return this.errors.length === 0;
  }
}

// CLI
const brandPath = process.argv[2] || '.';
const validator = new MRBSValidator(brandPath);
const isValid = validator.validate();
process.exit(isValid ? 0 : 1);
