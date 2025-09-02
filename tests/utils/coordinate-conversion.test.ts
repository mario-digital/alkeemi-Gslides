import { expect, test, describe } from 'bun:test';
import { ptToPixels, pixelsToPt, emuToPt, ptToEmu } from '@/lib/utils';

describe('Coordinate Conversion Functions', () => {
  describe('ptToPixels', () => {
    test('converts points to pixels at default DPI (96)', () => {
      expect(ptToPixels(72)).toBe(96); // 72pt = 1 inch = 96px at 96 DPI
      expect(ptToPixels(36)).toBe(48);
      expect(ptToPixels(144)).toBe(192);
    });

    test('converts points to pixels at custom DPI', () => {
      expect(ptToPixels(72, 72)).toBe(72);  // 72pt = 72px at 72 DPI
      expect(ptToPixels(72, 300)).toBe(300); // 72pt = 300px at 300 DPI
    });

    test('handles decimal values', () => {
      expect(ptToPixels(10.5)).toBeCloseTo(14);
      expect(ptToPixels(25.25)).toBeCloseTo(33.667, 2);
    });
  });

  describe('pixelsToPt', () => {
    test('converts pixels to points at default DPI (96)', () => {
      expect(pixelsToPt(96)).toBe(72); // 96px = 72pt at 96 DPI
      expect(pixelsToPt(48)).toBe(36);
      expect(pixelsToPt(192)).toBe(144);
    });

    test('converts pixels to points at custom DPI', () => {
      expect(pixelsToPt(72, 72)).toBe(72);   // 72px = 72pt at 72 DPI
      expect(pixelsToPt(300, 300)).toBe(72); // 300px = 72pt at 300 DPI
    });

    test('round-trip conversion maintains value', () => {
      const originalPt = 100;
      const pixels = ptToPixels(originalPt);
      const backToPt = pixelsToPt(pixels);
      expect(backToPt).toBeCloseTo(originalPt, 5);
    });
  });

  describe('emuToPt', () => {
    test('converts EMU to points correctly', () => {
      expect(emuToPt(12700)).toBe(1);     // 12700 EMU = 1 PT
      expect(emuToPt(25400)).toBe(2);     // 25400 EMU = 2 PT
      expect(emuToPt(914400)).toBe(72);   // 914400 EMU = 72 PT (1 inch)
    });

    test('handles fractional EMU values', () => {
      expect(emuToPt(6350)).toBe(0.5);
      expect(emuToPt(19050)).toBe(1.5);
    });
  });

  describe('ptToEmu', () => {
    test('converts points to EMU correctly', () => {
      expect(ptToEmu(1)).toBe(12700);     // 1 PT = 12700 EMU
      expect(ptToEmu(2)).toBe(25400);     // 2 PT = 25400 EMU
      expect(ptToEmu(72)).toBe(914400);   // 72 PT = 914400 EMU (1 inch)
    });

    test('handles fractional point values', () => {
      expect(ptToEmu(0.5)).toBe(6350);
      expect(ptToEmu(1.5)).toBe(19050);
    });

    test('round-trip conversion maintains value', () => {
      const originalPt = 50.5;
      const emu = ptToEmu(originalPt);
      const backToPt = emuToPt(emu);
      expect(backToPt).toBeCloseTo(originalPt, 10);
    });
  });

  describe('Google Slides API compliance', () => {
    test('slide dimensions are correct', () => {
      const slideWidthPt = 720;  // 10 inches
      const slideHeightPt = 405; // 5.625 inches (16:9 aspect ratio)
      
      expect(ptToEmu(slideWidthPt)).toBe(9144000);
      expect(ptToEmu(slideHeightPt)).toBe(5143500);
      
      expect(ptToPixels(slideWidthPt)).toBe(960);
      expect(ptToPixels(slideHeightPt)).toBe(540);
    });

    test('common element sizes convert correctly', () => {
      const elementWidthPt = 200;
      const elementHeightPt = 100;
      
      expect(ptToEmu(elementWidthPt)).toBe(2540000);
      expect(ptToEmu(elementHeightPt)).toBe(1270000);
      
      expect(ptToPixels(elementWidthPt)).toBeCloseTo(266.667, 2);
      expect(ptToPixels(elementHeightPt)).toBeCloseTo(133.333, 2);
    });
  });
});