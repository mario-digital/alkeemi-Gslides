import { expect, test, describe, beforeEach } from 'bun:test';
import { createShapeService } from '@/services/createShape';

describe('CreateShapeService', () => {
  beforeEach(() => {
    createShapeService.clearObjectIds();
  });

  describe('generateObjectId', () => {
    test('generates unique object IDs', () => {
      const id1 = createShapeService.generateObjectId('test');
      const id2 = createShapeService.generateObjectId('test');
      
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^test_[A-Za-z0-9]{8}$/);
      expect(id2).toMatch(/^test_[A-Za-z0-9]{8}$/);
    });

    test('prevents collision with existing IDs', () => {
      const ids = new Set<string>();
      for (let i = 0; i < 100; i++) {
        const id = createShapeService.generateObjectId('shape');
        expect(ids.has(id)).toBe(false);
        ids.add(id);
      }
    });
  });

  describe('createRectangle', () => {
    test('creates rectangle with default properties', () => {
      const rectangle = createShapeService.createRectangle();
      
      expect(rectangle.createShape.shapeType).toBe('RECTANGLE');
      expect(rectangle.createShape.objectId).toMatch(/^rect_/);
      expect(rectangle.createShape.elementProperties.size.width.magnitude).toBe(200);
      expect(rectangle.createShape.elementProperties.size.height.magnitude).toBe(100);
      expect(rectangle.createShape.elementProperties.transform.translateX).toBe(100);
      expect(rectangle.createShape.elementProperties.transform.translateY).toBe(100);
    });

    test('creates rectangle with custom position and size', () => {
      const rectangle = createShapeService.createRectangle(
        { x: 50, y: 75 },
        { width: 300, height: 150 }
      );
      
      expect(rectangle.createShape.elementProperties.size.width.magnitude).toBe(300);
      expect(rectangle.createShape.elementProperties.size.height.magnitude).toBe(150);
      expect(rectangle.createShape.elementProperties.transform.translateX).toBe(50);
      expect(rectangle.createShape.elementProperties.transform.translateY).toBe(75);
    });

    test('includes shape properties with fill and outline', () => {
      const rectangle = createShapeService.createRectangle();
      
      expect(rectangle.createShape.shapeProperties).toBeDefined();
      expect(rectangle.createShape.shapeProperties?.shapeBackgroundFill).toBeDefined();
      expect(rectangle.createShape.shapeProperties?.outline).toBeDefined();
      
      const fill = rectangle.createShape.shapeProperties?.shapeBackgroundFill?.solidFill;
      expect(fill?.color?.rgbColor?.red).toBe(0.66);
      expect(fill?.alpha).toBe(0.8);
      
      const outline = rectangle.createShape.shapeProperties?.outline;
      expect(outline?.weight?.magnitude).toBe(2);
      expect(outline?.dashStyle).toBe('SOLID');
    });
  });

  describe('createTextBox', () => {
    test('creates text box with insert text operation', () => {
      const textBox = createShapeService.createTextBox('Hello World');
      
      expect(Array.isArray(textBox)).toBe(true);
      expect(textBox).toHaveLength(2);
      
      const [createShape, insertText] = textBox;
      expect(createShape.createShape.shapeType).toBe('TEXT_BOX');
      expect(createShape.createShape.objectId).toMatch(/^text_/);
      
      expect(insertText.insertText.text).toBe('Hello World');
      expect(insertText.insertText.objectId).toBe(createShape.createShape.objectId);
      expect(insertText.insertText.insertionIndex).toBe(0);
    });

    test('uses default text when none provided', () => {
      const textBox = createShapeService.createTextBox();
      const insertText = textBox[1];
      
      expect(insertText.insertText.text).toBe('Click to edit text');
    });
  });

  describe('createImage', () => {
    test('creates image with placeholder URL', () => {
      const image = createShapeService.createImage();
      
      expect(image.createImage.objectId).toMatch(/^img_/);
      expect(image.createImage.url).toBe('https://via.placeholder.com/400x300');
      expect(image.createImage.elementProperties.size.width.magnitude).toBe(300);
      expect(image.createImage.elementProperties.size.height.magnitude).toBe(200);
    });

    test('creates image with custom URL and dimensions', () => {
      const image = createShapeService.createImage(
        'https://example.com/image.jpg',
        { x: 25, y: 50 },
        { width: 400, height: 300 }
      );
      
      expect(image.createImage.url).toBe('https://example.com/image.jpg');
      expect(image.createImage.elementProperties.size.width.magnitude).toBe(400);
      expect(image.createImage.elementProperties.size.height.magnitude).toBe(300);
      expect(image.createImage.elementProperties.transform.translateX).toBe(25);
    });
  });

  describe('createElement', () => {
    test('creates correct element type for each ElementType', () => {
      const rectangle = createShapeService.createElement('rectangle');
      expect('createShape' in rectangle).toBe(true);
      if ('createShape' in rectangle) {
        expect(rectangle.createShape.shapeType).toBe('RECTANGLE');
      }

      const textBox = createShapeService.createElement('textBox');
      expect(Array.isArray(textBox)).toBe(true);
      
      const image = createShapeService.createElement('image');
      expect('createImage' in image).toBe(true);
    });

    test('throws error for unknown element type', () => {
      expect(() => {
        createShapeService.createElement('unknown' as any);
      }).toThrow('Unknown element type: unknown');
    });
  });
});