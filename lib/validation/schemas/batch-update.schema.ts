import { z } from 'zod';

// Unit schemas
export const MagnitudeUnitSchema = z.enum(['EMU', 'PT']);

export const MagnitudeSchema = z.object({
  magnitude: z.number(),
  unit: MagnitudeUnitSchema
});

export const DimensionSchema = z.object({
  width: MagnitudeSchema,
  height: MagnitudeSchema
});

export const AffineTransformSchema = z.object({
  scaleX: z.number().optional(),
  scaleY: z.number().optional(),
  shearX: z.number().optional(),
  shearY: z.number().optional(),
  translateX: z.number().optional(),
  translateY: z.number().optional(),
  unit: MagnitudeUnitSchema.optional()
});

export const PageElementPropertiesSchema = z.object({
  pageObjectId: z.string(),
  size: DimensionSchema.optional(),
  transform: AffineTransformSchema.optional()
});

// Color schemas
export const RgbColorSchema = z.object({
  red: z.number().min(0, 'Red must be >= 0').max(1, 'Red must be <= 1').optional(),
  green: z.number().min(0, 'Green must be >= 0').max(1, 'Green must be <= 1').optional(),
  blue: z.number().min(0, 'Blue must be >= 0').max(1, 'Blue must be <= 1').optional()
});

export const OpaqueColorSchema = z.object({
  rgbColor: RgbColorSchema.optional(),
  themeColor: z.string().optional()
});

export const OptionalColorSchema = z.object({
  opaqueColor: OpaqueColorSchema.optional()
});

export const SolidFillSchema = z.object({
  color: OpaqueColorSchema.optional(),
  alpha: z.number().min(0).max(1).optional()
});

// Link schemas
export const LinkSchema = z.object({
  url: z.string().optional(),
  slideIndex: z.number().optional(),
  pageObjectId: z.string().optional(),
  relativeLink: z.enum(['NEXT_SLIDE', 'PREVIOUS_SLIDE', 'FIRST_SLIDE', 'LAST_SLIDE']).optional()
});

// Text schemas
export const TextRangeTypeSchema = z.enum(['FROM_START_INDEX', 'FIXED_RANGE', 'ALL']);

export const TextRangeSchema = z.object({
  startIndex: z.number().optional(),
  endIndex: z.number().optional(),
  type: TextRangeTypeSchema.optional()
});

export const TextStyleSchema = z.object({
  bold: z.boolean().optional(),
  italic: z.boolean().optional(),
  underline: z.boolean().optional(),
  strikethrough: z.boolean().optional(),
  smallCaps: z.boolean().optional(),
  fontSize: MagnitudeSchema.optional(),
  foregroundColor: OptionalColorSchema.optional(),
  backgroundColor: OptionalColorSchema.optional(),
  fontFamily: z.string().optional(),
  link: LinkSchema.optional()
});

// Shape properties schemas
export const PropertyStateSchema = z.enum(['RENDERED', 'NOT_RENDERED', 'INHERIT']);

export const ShapeBackgroundFillSchema = z.object({
  solidFill: SolidFillSchema.optional(),
  propertyState: PropertyStateSchema.optional()
});

export const OutlineFillSchema = z.object({
  solidFill: SolidFillSchema.optional()
});

export const OutlineSchema = z.object({
  outlineFill: OutlineFillSchema.optional(),
  weight: MagnitudeSchema.optional(),
  dashStyle: z.string().optional(),
  propertyState: PropertyStateSchema.optional()
});

export const ShadowAlignmentSchema = z.enum([
  'TOP_LEFT', 'TOP_CENTER', 'TOP_RIGHT',
  'MIDDLE_LEFT', 'MIDDLE_CENTER', 'MIDDLE_RIGHT',
  'BOTTOM_LEFT', 'BOTTOM_CENTER', 'BOTTOM_RIGHT'
]);

export const ShadowSchema = z.object({
  type: z.enum(['OUTER', 'INNER']).optional(),
  transform: AffineTransformSchema.optional(),
  alignment: ShadowAlignmentSchema.optional(),
  color: OpaqueColorSchema.optional(),
  alpha: z.number().min(0).max(1).optional(),
  blurRadius: MagnitudeSchema.optional(),
  propertyState: PropertyStateSchema.optional(),
  rotateWithShape: z.boolean().optional()
});

export const ShapePropertiesSchema = z.object({
  shapeBackgroundFill: ShapeBackgroundFillSchema.optional(),
  outline: OutlineSchema.optional(),
  shadow: ShadowSchema.optional(),
  link: LinkSchema.optional()
});

// Page properties schemas
export const PageBackgroundFillSchema = z.object({
  solidFill: SolidFillSchema.optional(),
  propertyState: PropertyStateSchema.optional()
});

export const ThemeColorPairSchema = z.object({
  type: z.string().optional(),
  color: RgbColorSchema.optional()
});

export const ColorSchemeSchema = z.object({
  colors: z.array(ThemeColorPairSchema).optional()
});

export const PagePropertiesSchema = z.object({
  pageBackgroundFill: PageBackgroundFillSchema.optional(),
  colorScheme: ColorSchemeSchema.optional()
});

// Request schemas
export const CreateSlideRequestSchema = z.object({
  createSlide: z.object({
    objectId: z.string().optional(),
    insertionIndex: z.number().optional(),
    slideLayoutReference: z.object({
      predefinedLayout: z.string().optional(),
      layoutId: z.string().optional()
    }).optional()
  })
});

export const CreateShapeRequestSchema = z.object({
  createShape: z.object({
    objectId: z.string().optional(),
    shapeType: z.string().min(1, 'shapeType is required'),
    elementProperties: PageElementPropertiesSchema
  })
});

export const CreateTableRequestSchema = z.object({
  createTable: z.object({
    objectId: z.string().optional(),
    elementProperties: PageElementPropertiesSchema,
    rows: z.number().positive(),
    columns: z.number().positive()
  })
});

export const UpdatePageElementTransformRequestSchema = z.object({
  updatePageElementTransform: z.object({
    objectId: z.string(),
    transform: AffineTransformSchema,
    applyMode: z.enum(['RELATIVE', 'ABSOLUTE'])
  })
});

export const DeleteObjectRequestSchema = z.object({
  deleteObject: z.object({
    objectId: z.string()
  })
});

export const InsertTextRequestSchema = z.object({
  insertText: z.object({
    objectId: z.string(),
    text: z.string(),
    insertionIndex: z.number().optional()
  })
});

export const DeleteTextRequestSchema = z.object({
  deleteText: z.object({
    objectId: z.string(),
    textRange: TextRangeSchema
  })
});

export const UpdateTextStyleRequestSchema = z.object({
  updateTextStyle: z.object({
    objectId: z.string(),
    style: TextStyleSchema,
    textRange: TextRangeSchema.optional(),
    fields: z.string()
  })
});

export const UpdateShapePropertiesRequestSchema = z.object({
  updateShapeProperties: z.object({
    objectId: z.string(),
    shapeProperties: ShapePropertiesSchema,
    fields: z.string()
  })
});

export const UpdatePagePropertiesRequestSchema = z.object({
  updatePageProperties: z.object({
    objectId: z.string(),
    pageProperties: PagePropertiesSchema,
    fields: z.string()
  })
});

// Main batch update operation schema
export const BatchUpdateOperationSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('createSlide'), ...CreateSlideRequestSchema.shape }),
  z.object({ type: z.literal('createShape'), ...CreateShapeRequestSchema.shape }),
  z.object({ type: z.literal('createTable'), ...CreateTableRequestSchema.shape }),
  z.object({ type: z.literal('updatePageElementTransform'), ...UpdatePageElementTransformRequestSchema.shape }),
  z.object({ type: z.literal('deleteObject'), ...DeleteObjectRequestSchema.shape }),
  z.object({ type: z.literal('insertText'), ...InsertTextRequestSchema.shape }),
  z.object({ type: z.literal('deleteText'), ...DeleteTextRequestSchema.shape }),
  z.object({ type: z.literal('updateTextStyle'), ...UpdateTextStyleRequestSchema.shape }),
  z.object({ type: z.literal('updateShapeProperties'), ...UpdateShapePropertiesRequestSchema.shape }),
  z.object({ type: z.literal('updatePageProperties'), ...UpdatePagePropertiesRequestSchema.shape })
]).or(
  // Alternative: accept operations without type field
  z.union([
    CreateSlideRequestSchema,
    CreateShapeRequestSchema,
    CreateTableRequestSchema,
    UpdatePageElementTransformRequestSchema,
    DeleteObjectRequestSchema,
    InsertTextRequestSchema,
    DeleteTextRequestSchema,
    UpdateTextStyleRequestSchema,
    UpdateShapePropertiesRequestSchema,
    UpdatePagePropertiesRequestSchema
  ])
);

// Main batch update request schema
export const BatchUpdateRequestSchema = z.object({
  requests: z.array(BatchUpdateOperationSchema)
});

// Validation helper functions
export function validateBatchUpdateRequest(data: unknown): { 
  success: boolean; 
  data?: z.infer<typeof BatchUpdateRequestSchema>; 
  errors?: z.ZodError 
} {
  const result = BatchUpdateRequestSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}

export function validateBatchUpdateOperation(operation: unknown): {
  success: boolean;
  data?: z.infer<typeof BatchUpdateOperationSchema>;
  errors?: z.ZodError;
} {
  const result = BatchUpdateOperationSchema.safeParse(operation);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}

// Type exports for TypeScript
export type BatchUpdateRequest = z.infer<typeof BatchUpdateRequestSchema>;
export type BatchUpdateOperation = z.infer<typeof BatchUpdateOperationSchema>;