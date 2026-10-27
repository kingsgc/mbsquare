#!/usr/bin/env node

/**
 * DataWise Icon Generator
 *
 * Generates all required icon PNGs from the logo SVG.
 *
 * Usage:
 *   npm install sharp  (if not installed)
 *   node scripts/generate-icons.js
 *
 * Or use the HTML version: open scripts/generate-icons.html in a browser.
 */

const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '..', 'assets', 'images');
const SVG_PATH = path.join(IMAGES_DIR, 'logo.svg');

// Icon configurations
const ICONS = [
  { name: 'icon.png', size: 1024 },
  { name: 'favicon.png', size: 48 },
  { name: 'splash-icon.png', size: 200 },
  { name: 'android-icon-foreground.png', size: 432 },
  { name: 'android-icon-background.png', size: 432 },
  { name: 'android-icon-monochrome.png', size: 432 },
];

// Monochrome SVG (white circle on transparent)
const MONOCHROME_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 432 432" width="432" height="432">
  <circle cx="216" cy="176" rx="98" ry="98" fill="#FFFFFF"/>
  <text x="200" y="182" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="120" font-weight="800" fill="#000000" text-anchor="middle" dominant-baseline="middle">D</text>
  <text x="250" y="205" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="52" font-weight="600" fill="#000000" text-anchor="start" dominant-baseline="middle">w</text>
  <text x="216" y="320" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="30" font-weight="800" fill="#000000" text-anchor="middle">DataWise</text>
</svg>`;

// Background-only SVG (gradient fill)
const BACKGROUND_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 432 432" width="432" height="432">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F3F5F9"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>
  </defs>
  <rect width="432" height="432" fill="url(#bg)"/>
</svg>`;

async function generateIcons() {
  let sharp;
  try {
    sharp = require('sharp');
  } catch {
    console.log('sharp not installed. Installing...');
    const { execSync } = require('child_process');
    execSync('npm install sharp', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
    sharp = require('sharp');
  }

  if (!fs.existsSync(SVG_PATH)) {
    console.error('Logo SVG not found at', SVG_PATH);
    process.exit(1);
  }

  const svgBuffer = fs.readFileSync(SVG_PATH);

  for (const icon of ICONS) {
    const outPath = path.join(IMAGES_DIR, icon.name);

    // Use monochrome SVG for monochrome icon
    let input = svgBuffer;
    if (icon.name === 'android-icon-monochrome.png') {
      input = Buffer.from(MONOCHROME_SVG);
    } else if (icon.name === 'android-icon-background.png') {
      input = Buffer.from(BACKGROUND_SVG);
    }

    await sharp(input)
      .resize(icon.size, icon.size)
      .png()
      .toFile(outPath);

    console.log(`  Created ${icon.name} (${icon.size}x${icon.size})`);
  }

  console.log('\nAll DataWise icons generated successfully!');
}

generateIcons().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
