import { nanoid } from '@/lib/utils';
import type { ElementType } from '@/components/editor/ElementToolbar';

export interface CreateShapeRequest {
  createShape: {
    objectId: string;
    shapeType: string;
    elementProperties: {
      pageObjectId: string;
      size: {
        width: { magnitude: number; unit: 'PT' };
        height: { magnitude: number; unit: 'PT' };
      };
      transform: {
        scaleX: number;
        scaleY: number;
        translateX: number;
        translateY: number;
        unit: 'PT';
      };
    };
    shapeProperties?: {
      shapeBackgroundFill?: {
        solidFill?: {
          color: {
            rgbColor: {
              red?: number;
              green?: number;
              blue?: number;
            };
          };
          alpha?: number;
        };
      };
      outline?: {
        weight?: { magnitude: number; unit: 'PT' };
        dashStyle?: string;
        outlineFill?: {
          solidFill?: {
            color: {
              rgbColor: {
                red?: number;
                green?: number;
                blue?: number;
              };
            };
            alpha?: number;
          };
        };
      };
    };
  };
}

export interface CreateTextBoxRequest {
  createShape: {
    objectId: string;
    shapeType: 'TEXT_BOX';
    elementProperties: {
      pageObjectId: string;
      size: {
        width: { magnitude: number; unit: 'PT' };
        height: { magnitude: number; unit: 'PT' };
      };
      transform: {
        scaleX: number;
        scaleY: number;
        translateX: number;
        translateY: number;
        unit: 'PT';
      };
    };
  };
  insertText?: {
    objectId: string;
    text: string;
    insertionIndex: number;
  };
}

export interface CreateImageRequest {
  createImage: {
    objectId: string;
    url?: string;
    elementProperties: {
      pageObjectId: string;
      size: {
        width: { magnitude: number; unit: 'PT' };
        height: { magnitude: number; unit: 'PT' };
      };
      transform: {
        scaleX: number;
        scaleY: number;
        translateX: number;
        translateY: number;
        unit: 'PT';
      };
    };
  };
}

export type BatchUpdateRequest = CreateShapeRequest | CreateTextBoxRequest | CreateImageRequest;

const DEFAULT_SIZE = {
  width: { magnitude: 200, unit: 'PT' as const },
  height: { magnitude: 100, unit: 'PT' as const }
};

const DEFAULT_TRANSFORM = {
  scaleX: 1,
  scaleY: 1,
  translateX: 100,
  translateY: 100,
  unit: 'PT' as const
};

const DEFAULT_FILL = {
  solidFill: {
    color: {
      rgbColor: {
        red: 0.66,
        green: 0.33,
        blue: 0.97
      }
    },
    alpha: 0.8
  }
};

const DEFAULT_OUTLINE = {
  weight: { magnitude: 2, unit: 'PT' as const },
  dashStyle: 'SOLID',
  outlineFill: {
    solidFill: {
      color: {
        rgbColor: {
          red: 0.02,
          green: 1.0,
          blue: 0.65
        }
      },
      alpha: 1.0
    }
  }
};

export class CreateShapeService {
  private usedObjectIds = new Set<string>();
  private currentPageId = 'slide1';

  generateObjectId(prefix = 'shape'): string {
    let objectId: string;
    do {
      objectId = `${prefix}_${nanoid(8)}`;
    } while (this.usedObjectIds.has(objectId));
    
    this.usedObjectIds.add(objectId);
    return objectId;
  }

  setCurrentPageId(pageId: string): void {
    this.currentPageId = pageId;
  }

  createRectangle(
    position?: { x: number; y: number },
    size?: { width: number; height: number }
  ): CreateShapeRequest {
    const objectId = this.generateObjectId('rect');
    
    return {
      createShape: {
        objectId,
        shapeType: 'RECTANGLE',
        elementProperties: {
          pageObjectId: this.currentPageId,
          size: size ? {
            width: { magnitude: size.width, unit: 'PT' },
            height: { magnitude: size.height, unit: 'PT' }
          } : DEFAULT_SIZE,
          transform: position ? {
            ...DEFAULT_TRANSFORM,
            translateX: position.x,
            translateY: position.y
          } : DEFAULT_TRANSFORM
        },
        shapeProperties: {
          shapeBackgroundFill: DEFAULT_FILL,
          outline: DEFAULT_OUTLINE
        }
      }
    };
  }

  createEllipse(
    position?: { x: number; y: number },
    size?: { width: number; height: number }
  ): CreateShapeRequest {
    const objectId = this.generateObjectId('ellipse');
    
    return {
      createShape: {
        objectId,
        shapeType: 'ELLIPSE',
        elementProperties: {
          pageObjectId: this.currentPageId,
          size: size ? {
            width: { magnitude: size.width, unit: 'PT' },
            height: { magnitude: size.height, unit: 'PT' }
          } : DEFAULT_SIZE,
          transform: position ? {
            ...DEFAULT_TRANSFORM,
            translateX: position.x,
            translateY: position.y
          } : DEFAULT_TRANSFORM
        },
        shapeProperties: {
          shapeBackgroundFill: DEFAULT_FILL,
          outline: DEFAULT_OUTLINE
        }
      }
    };
  }

  createTriangle(
    position?: { x: number; y: number },
    size?: { width: number; height: number }
  ): CreateShapeRequest {
    const objectId = this.generateObjectId('triangle');
    
    return {
      createShape: {
        objectId,
        shapeType: 'TRIANGLE',
        elementProperties: {
          pageObjectId: this.currentPageId,
          size: size ? {
            width: { magnitude: size.width, unit: 'PT' },
            height: { magnitude: size.height, unit: 'PT' }
          } : DEFAULT_SIZE,
          transform: position ? {
            ...DEFAULT_TRANSFORM,
            translateX: position.x,
            translateY: position.y
          } : DEFAULT_TRANSFORM
        },
        shapeProperties: {
          shapeBackgroundFill: DEFAULT_FILL,
          outline: DEFAULT_OUTLINE
        }
      }
    };
  }

  createLine(
    position?: { x: number; y: number },
    size?: { width: number; height: number }
  ): CreateShapeRequest {
    const objectId = this.generateObjectId('line');
    
    return {
      createShape: {
        objectId,
        shapeType: 'LINE',
        elementProperties: {
          pageObjectId: this.currentPageId,
          size: size ? {
            width: { magnitude: size.width, unit: 'PT' },
            height: { magnitude: 1, unit: 'PT' }
          } : { ...DEFAULT_SIZE, height: { magnitude: 1, unit: 'PT' } },
          transform: position ? {
            ...DEFAULT_TRANSFORM,
            translateX: position.x,
            translateY: position.y
          } : DEFAULT_TRANSFORM
        },
        shapeProperties: {
          outline: DEFAULT_OUTLINE
        }
      }
    };
  }

  createArrow(
    position?: { x: number; y: number },
    size?: { width: number; height: number }
  ): CreateShapeRequest {
    const objectId = this.generateObjectId('arrow');
    
    return {
      createShape: {
        objectId,
        shapeType: 'ARROW',
        elementProperties: {
          pageObjectId: this.currentPageId,
          size: size ? {
            width: { magnitude: size.width, unit: 'PT' },
            height: { magnitude: 2, unit: 'PT' }
          } : { ...DEFAULT_SIZE, height: { magnitude: 2, unit: 'PT' } },
          transform: position ? {
            ...DEFAULT_TRANSFORM,
            translateX: position.x,
            translateY: position.y
          } : DEFAULT_TRANSFORM
        },
        shapeProperties: {
          outline: DEFAULT_OUTLINE
        }
      }
    };
  }

  createTextBox(
    text = 'Click to edit text',
    position?: { x: number; y: number },
    size?: { width: number; height: number }
  ): CreateTextBoxRequest[] {
    const objectId = this.generateObjectId('text');
    
    const createShape: CreateTextBoxRequest = {
      createShape: {
        objectId,
        shapeType: 'TEXT_BOX',
        elementProperties: {
          pageObjectId: this.currentPageId,
          size: size ? {
            width: { magnitude: size.width, unit: 'PT' },
            height: { magnitude: size.height, unit: 'PT' }
          } : DEFAULT_SIZE,
          transform: position ? {
            ...DEFAULT_TRANSFORM,
            translateX: position.x,
            translateY: position.y
          } : DEFAULT_TRANSFORM
        }
      }
    };

    const insertText: any = {
      insertText: {
        objectId,
        text,
        insertionIndex: 0
      }
    };

    return [createShape, insertText];
  }

  createImage(
    url?: string,
    position?: { x: number; y: number },
    size?: { width: number; height: number }
  ): CreateImageRequest {
    const objectId = this.generateObjectId('img');
    
    return {
      createImage: {
        objectId,
        url: url || 'https://via.placeholder.com/400x300',
        elementProperties: {
          pageObjectId: this.currentPageId,
          size: size ? {
            width: { magnitude: size.width, unit: 'PT' },
            height: { magnitude: size.height, unit: 'PT' }
          } : {
            width: { magnitude: 300, unit: 'PT' },
            height: { magnitude: 200, unit: 'PT' }
          },
          transform: position ? {
            ...DEFAULT_TRANSFORM,
            translateX: position.x,
            translateY: position.y
          } : DEFAULT_TRANSFORM
        }
      }
    };
  }

  createElement(
    elementType: ElementType,
    position?: { x: number; y: number },
    size?: { width: number; height: number }
  ): BatchUpdateRequest | BatchUpdateRequest[] {
    switch (elementType) {
      case 'rectangle':
        return this.createRectangle(position, size);
      case 'ellipse':
        return this.createEllipse(position, size);
      case 'triangle':
        return this.createTriangle(position, size);
      case 'line':
        return this.createLine(position, size);
      case 'arrow':
        return this.createArrow(position, size);
      case 'textBox':
        return this.createTextBox('Click to edit text', position, size);
      case 'image':
        return this.createImage(undefined, position, size);
      default:
        throw new Error(`Unknown element type: ${elementType}`);
    }
  }

  clearObjectIds(): void {
    this.usedObjectIds.clear();
  }
}

export const createShapeService = new CreateShapeService();