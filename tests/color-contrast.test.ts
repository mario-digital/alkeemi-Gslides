import { describe, test, expect } from 'bun:test';

// Color values from design system
const colors = {
  backgrounds: {
    primary: '#0a0a0f',
    secondary: '#1a1a2e',
    tertiary: '#16213e'
  },
  text: {
    primary: '#f8fafc',
    secondary: '#cbd5e1',
    muted: '#64748b'
  },
  neon: {
    primary: '#a855f7',
    secondary: '#8b5cf6'
  },
  accent: {
    electric: '#06ffa5',
    pink: '#ec4899',
    cyan: '#22d3ee'
  },
  semantic: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  }
};

// Convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

// Calculate relative luminance
function getLuminance(rgb: { r: number; g: number; b: number }): number {
  const rsRGB = rgb.r / 255;
  const gsRGB = rgb.g / 255;
  const bsRGB = rgb.b / 255;

  const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Calculate contrast ratio
function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  const l1 = getLuminance(rgb1);
  const l2 = getLuminance(rgb2);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

describe('Color Contrast Ratios', () => {
  const MIN_CONTRAST_RATIO = 7; // Target 7:1 ratio

  test('Primary text on all backgrounds meets 7:1 ratio', () => {
    const textColor = colors.text.primary;
    
    const bgPrimaryRatio = getContrastRatio(textColor, colors.backgrounds.primary);
    const bgSecondaryRatio = getContrastRatio(textColor, colors.backgrounds.secondary);
    const bgTertiaryRatio = getContrastRatio(textColor, colors.backgrounds.tertiary);
    
    console.log('Primary text contrasts:');
    console.log(`  On bg-primary: ${bgPrimaryRatio.toFixed(2)}:1`);
    console.log(`  On bg-secondary: ${bgSecondaryRatio.toFixed(2)}:1`);
    console.log(`  On bg-tertiary: ${bgTertiaryRatio.toFixed(2)}:1`);
    
    expect(bgPrimaryRatio).toBeGreaterThanOrEqual(MIN_CONTRAST_RATIO);
    expect(bgSecondaryRatio).toBeGreaterThanOrEqual(MIN_CONTRAST_RATIO);
    expect(bgTertiaryRatio).toBeGreaterThanOrEqual(MIN_CONTRAST_RATIO);
  });

  test('Secondary text on primary backgrounds meets 7:1 ratio', () => {
    const textColor = colors.text.secondary;
    
    const bgPrimaryRatio = getContrastRatio(textColor, colors.backgrounds.primary);
    const bgSecondaryRatio = getContrastRatio(textColor, colors.backgrounds.secondary);
    
    console.log('Secondary text contrasts:');
    console.log(`  On bg-primary: ${bgPrimaryRatio.toFixed(2)}:1`);
    console.log(`  On bg-secondary: ${bgSecondaryRatio.toFixed(2)}:1`);
    
    expect(bgPrimaryRatio).toBeGreaterThanOrEqual(MIN_CONTRAST_RATIO);
    expect(bgSecondaryRatio).toBeGreaterThanOrEqual(MIN_CONTRAST_RATIO);
  });

  test('Accent colors on dark backgrounds meet minimum ratios', () => {
    const bgPrimary = colors.backgrounds.primary;
    
    const electricRatio = getContrastRatio(colors.accent.electric, bgPrimary);
    const cyanRatio = getContrastRatio(colors.accent.cyan, bgPrimary);
    const successRatio = getContrastRatio(colors.semantic.success, bgPrimary);
    const warningRatio = getContrastRatio(colors.semantic.warning, bgPrimary);
    
    console.log('Accent color contrasts on bg-primary:');
    console.log(`  Electric green: ${electricRatio.toFixed(2)}:1`);
    console.log(`  Cyan: ${cyanRatio.toFixed(2)}:1`);
    console.log(`  Success: ${successRatio.toFixed(2)}:1`);
    console.log(`  Warning: ${warningRatio.toFixed(2)}:1`);
    
    // These should meet at least 4.5:1 for UI components
    const MIN_UI_RATIO = 4.5;
    expect(electricRatio).toBeGreaterThanOrEqual(MIN_UI_RATIO);
    expect(cyanRatio).toBeGreaterThanOrEqual(MIN_UI_RATIO);
    expect(successRatio).toBeGreaterThanOrEqual(MIN_UI_RATIO);
    expect(warningRatio).toBeGreaterThanOrEqual(MIN_UI_RATIO);
  });

  test('Neon colors are accessible for UI elements', () => {
    const bgPrimary = colors.backgrounds.primary;
    
    const primaryNeonRatio = getContrastRatio(colors.neon.primary, bgPrimary);
    const secondaryNeonRatio = getContrastRatio(colors.neon.secondary, bgPrimary);
    
    console.log('Neon color contrasts on bg-primary:');
    console.log(`  Primary neon: ${primaryNeonRatio.toFixed(2)}:1`);
    console.log(`  Secondary neon: ${secondaryNeonRatio.toFixed(2)}:1`);
    
    // Neon colors for UI elements should meet 3:1 minimum
    const MIN_UI_DECORATIVE = 3;
    expect(primaryNeonRatio).toBeGreaterThanOrEqual(MIN_UI_DECORATIVE);
    expect(secondaryNeonRatio).toBeGreaterThanOrEqual(MIN_UI_DECORATIVE);
  });

  test('Error states have sufficient contrast', () => {
    const errorColor = colors.semantic.error;
    const bgPrimary = colors.backgrounds.primary;
    
    const errorRatio = getContrastRatio(errorColor, bgPrimary);
    
    console.log('Error state contrast:');
    console.log(`  Error on bg-primary: ${errorRatio.toFixed(2)}:1`);
    
    // Error states should meet at least 4.5:1
    expect(errorRatio).toBeGreaterThanOrEqual(4.5);
  });
});

describe('Color Values Verification', () => {
  test('All colors match exact specification', () => {
    // Verify exact hex codes
    expect(colors.backgrounds.primary).toBe('#0a0a0f');
    expect(colors.backgrounds.secondary).toBe('#1a1a2e');
    expect(colors.backgrounds.tertiary).toBe('#16213e');
    expect(colors.neon.primary).toBe('#a855f7');
    expect(colors.neon.secondary).toBe('#8b5cf6');
    expect(colors.accent.electric).toBe('#06ffa5');
    expect(colors.accent.pink).toBe('#ec4899');
    expect(colors.accent.cyan).toBe('#22d3ee');
    expect(colors.text.primary).toBe('#f8fafc');
    expect(colors.text.secondary).toBe('#cbd5e1');
    expect(colors.text.muted).toBe('#64748b');
    expect(colors.semantic.success).toBe('#10b981');
    expect(colors.semantic.warning).toBe('#f59e0b');
    expect(colors.semantic.error).toBe('#ef4444');
  });
});