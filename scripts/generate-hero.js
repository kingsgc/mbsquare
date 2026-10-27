#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const OUTPUT = path.join(__dirname, '..', 'assets', 'images', 'hero-datawise.png');

const HERO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#1E293B"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0A84FF"/>
      <stop offset="100%" stop-color="#0066CC"/>
    </linearGradient>
    <filter id="shadow1" x="-5%" y="-5%" width="110%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000" flood-opacity="0.3"/>
    </filter>
    <filter id="shadow2" x="-5%" y="-5%" width="110%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity="0.2"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="600" height="400" rx="16" fill="url(#bg)"/>

  <!-- Decorative circles -->
  <circle cx="520" cy="80" r="120" fill="#0A84FF" opacity="0.08"/>
  <circle cx="80" cy="350" r="80" fill="#0A84FF" opacity="0.06"/>

  <!-- Phone mockup frame -->
  <rect x="200" y="20" width="200" height="360" rx="20" fill="#1A1A2E" stroke="#334155" stroke-width="2" filter="url(#shadow1)"/>
  <rect x="210" y="40" width="180" height="320" rx="12" fill="#F8FAFC"/>

  <!-- Phone status bar -->
  <rect x="210" y="40" width="180" height="30" rx="12" fill="#0A84FF"/>
  <text x="300" y="60" font-family="Arial, sans-serif" font-size="11" font-weight="700" fill="#FFF" text-anchor="middle">DataWise</text>

  <!-- Dashboard content inside phone -->
  <!-- Balance card -->
  <rect x="218" y="78" width="164" height="60" rx="10" fill="#FFF" stroke="#E2E8F0" stroke-width="1"/>
  <text x="230" y="96" font-family="Arial, sans-serif" font-size="9" fill="#64748B">Wallet Balance</text>
  <text x="230" y="118" font-family="Arial, sans-serif" font-size="18" font-weight="800" fill="#0F172A">₦25,400</text>
  <rect x="345" y="86" width="30" height="20" rx="5" fill="#0A84FF"/>
  <text x="360" y="100" font-family="Arial, sans-serif" font-size="8" font-weight="700" fill="#FFF" text-anchor="middle">+ Fund</text>

  <!-- Service grid -->
  <rect x="218" y="148" width="76" height="65" rx="10" fill="#FFF" stroke="#E2E8F0" stroke-width="1"/>
  <circle cx="256" y="170" r="14" fill="#E6F5EC"/>
  <text x="256" y="175" font-family="Arial, sans-serif" font-size="14" fill="#0A84FF" text-anchor="middle">📱</text>
  <text x="256" y="202" font-family="Arial, sans-serif" font-size="8" font-weight="600" fill="#0F172A" text-anchor="middle">Airtime</text>

  <rect x="306" y="148" width="76" height="65" rx="10" fill="#FFF" stroke="#E2E8F0" stroke-width="1"/>
  <circle cx="344" y="170" r="14" fill="#E6F5EC"/>
  <text x="344" y="175" font-family="Arial, sans-serif" font-size="14" fill="#0A84FF" text-anchor="middle">📶</text>
  <text x="344" y="202" font-family="Arial, sans-serif" font-size="8" font-weight="600" fill="#0F172A" text-anchor="middle">Data</text>

  <rect x="218" y="223" width="76" height="65" rx="10" fill="#FFF" stroke="#E2E8F0" stroke-width="1"/>
  <circle cx="256" y="245" r="14" fill="#E6F5EC"/>
  <text x="256" y="250" font-family="Arial, sans-serif" font-size="14" fill="#0A84FF" text-anchor="middle">📺</text>
  <text x="256" y="277" font-family="Arial, sans-serif" font-size="8" font-weight="600" fill="#0F172A" text-anchor="middle">Cable TV</text>

  <rect x="306" y="223" width="76" height="65" rx="10" fill="#FFF" stroke="#E2E8F0" stroke-width="1"/>
  <circle cx="344" y="245" r="14" fill="#E6F5EC"/>
  <text x="344" y="250" font-family="Arial, sans-serif" font-size="14" fill="#0A84FF" text-anchor="middle">⚡</text>
  <text x="344" y="277" font-family="Arial, sans-serif" font-size="8" font-weight="600" fill="#0F172A" text-anchor="middle">Electric</text>

  <!-- Recent transactions -->
  <rect x="218" y="298" width="164" height="55" rx="10" fill="#FFF" stroke="#E2E8F0" stroke-width="1"/>
  <text x="230" y="315" font-family="Arial, sans-serif" font-size="8" font-weight="700" fill="#0F172A">Recent Activity</text>
  <line x1="228" y1="325" x2="372" y2="325" stroke="#F1F5F9" stroke-width="1"/>
  <circle cx="238" cy="338" r="6" fill="#DCFCE7"/>
  <text x="250" y="341" font-family="Arial, sans-serif" font-size="7" fill="#0F172A">MTN Airtime ₦500</text>
  <text x="370" y="341" font-family="Arial, sans-serif" font-size="7" fill="#22C55E" text-anchor="end">✓ Success</text>

  <!-- Left side - floating cards -->
  <!-- Stats card -->
  <g transform="translate(30, 60)" filter="url(#shadow2)">
    <rect width="140" height="90" rx="12" fill="#FFF"/>
    <text x="16" y="28" font-family="Arial, sans-serif" font-size="10" fill="#64748B">Today's Sales</text>
    <text x="16" y="52" font-family="Arial, sans-serif" font-size="22" font-weight="800" fill="#0F172A">₦1.2M</text>
    <text x="16" y="72" font-family="Arial, sans-serif" font-size="10" font-weight="600" fill="#22C55E">↑ 12.5%</text>
    <text x="80" y="72" font-family="Arial, sans-serif" font-size="9" fill="#94A3B8">vs yesterday</text>
  </g>

  <!-- Right side - floating cards -->
  <!-- Users card -->
  <g transform="translate(430, 120)" filter="url(#shadow2)">
    <rect width="140" height="80" rx="12" fill="#FFF"/>
    <text x="16" y="28" font-family="Arial, sans-serif" font-size="10" fill="#64748B">Active Users</text>
    <text x="16" y="52" font-family="Arial, sans-serif" font-size="22" font-weight="800" fill="#0F172A">10,247</text>
    <text x="16" y="70" font-family="Arial, sans-serif" font-size="10" font-weight="600" fill="#22C55E">↑ 8.3%</text>
  </g>

  <!-- Transactions card -->
  <g transform="translate(430, 220)" filter="url(#shadow2)">
    <rect width="140" height="80" rx="12" fill="#FFF"/>
    <text x="16" y="28" font-family="Arial, sans-serif" font-size="10" fill="#64748B">Transactions</text>
    <text x="16" y="52" font-family="Arial, sans-serif" font-size="22" font-weight="800" fill="#0F172A">5,892</text>
    <text x="16" y="70" font-family="Arial, sans-serif" font-size="10" font-weight="600" fill="#22C55E">↑ 15.2%</text>
  </g>

  <!-- Mini bar chart -->
  <g transform="translate(430, 320)" filter="url(#shadow2)">
    <rect width="140" height="60" rx="10" fill="#FFF"/>
    <text x="16" y="20" font-family="Arial, sans-serif" font-size="8" fill="#64748B">Weekly Revenue</text>
    <rect x="16" y="38" width="12" height="14" rx="2" fill="#E2E8F0"/>
    <rect x="32" y="32" width="12" height="20" rx="2" fill="#E2E8F0"/>
    <rect x="48" y="28" width="12" height="24" rx="2" fill="#0A84FF"/>
    <rect x="64" y="35" width="12" height="17" rx="2" fill="#E2E8F0"/>
    <rect x="80" y="25" width="12" height="27" rx="2" fill="#0A84FF"/>
    <rect x="96" y="30" width="12" height="22" rx="2" fill="#E2E8F0"/>
    <rect x="112" y="22" width="12" height="30" rx="2" fill="#0A84FF"/>
  </g>

  <!-- Brand watermark -->
  <text x="300" y="392" font-family="Arial, sans-serif" font-size="8" fill="#475569" text-anchor="middle" opacity="0.5">DataWise - Smart VTU Platform</text>
</svg>`;

async function generate() {
  let sharp;
  try {
    sharp = require('sharp');
  } catch {
    console.log('Installing sharp...');
    const { execSync } = require('child_process');
    execSync('npm install sharp', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
    sharp = require('sharp');
  }

  await sharp(Buffer.from(HERO_SVG))
    .resize(600, 400)
    .png()
    .toFile(OUTPUT);

  console.log(`Hero image created: ${OUTPUT}`);

  // Also copy to website
  const websitePath = path.join(__dirname, '..', '..', '..', 'Users', 'NEMA DOLE SB', 'Desktop', 'backup', 'mbswebsite', 'assets', 'img', 'hero-datawise.png');
  try {
    const fs2 = require('fs');
    if (fs2.existsSync(path.dirname(websitePath))) {
      fs2.copyFileSync(OUTPUT, websitePath);
      console.log(`Copied to website: ${websitePath}`);
    }
  } catch (e) {
    console.log('Could not copy to website (will copy manually)');
  }
}

generate().catch(console.error);
