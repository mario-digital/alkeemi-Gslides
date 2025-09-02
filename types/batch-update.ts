export interface BatchUpdateRequest {
  requests: BatchUpdateOperation[]
}

export type BatchUpdateOperation = 
  | CreateSlideRequest
  | CreateShapeRequest
  | CreateTableRequest
  | UpdatePageElementTransformRequest
  | DeleteObjectRequest
  | InsertTextRequest
  | DeleteTextRequest
  | UpdateTextStyleRequest
  | UpdateShapePropertiesRequest
  | UpdatePagePropertiesRequest

export interface CreateSlideRequest {
  createSlide: {
    objectId?: string
    insertionIndex?: number
    slideLayoutReference?: {
      predefinedLayout?: string
      layoutId?: string
    }
  }
}

export interface CreateShapeRequest {
  createShape: {
    objectId?: string
    shapeType: string
    elementProperties: PageElementProperties
  }
}

export interface CreateTableRequest {
  createTable: {
    objectId?: string
    elementProperties: PageElementProperties
    rows: number
    columns: number
  }
}

export interface UpdatePageElementTransformRequest {
  updatePageElementTransform: {
    objectId: string
    transform: AffineTransform
    applyMode: 'RELATIVE' | 'ABSOLUTE'
  }
}

export interface DeleteObjectRequest {
  deleteObject: {
    objectId: string
  }
}

export interface InsertTextRequest {
  insertText: {
    objectId: string
    text: string
    insertionIndex?: number
  }
}

export interface DeleteTextRequest {
  deleteText: {
    objectId: string
    textRange: TextRange
  }
}

export interface UpdateTextStyleRequest {
  updateTextStyle: {
    objectId: string
    style: TextStyle
    textRange?: TextRange
    fields: string
  }
}

export interface UpdateShapePropertiesRequest {
  updateShapeProperties: {
    objectId: string
    shapeProperties: ShapeProperties
    fields: string
  }
}

export interface UpdatePagePropertiesRequest {
  updatePageProperties: {
    objectId: string
    pageProperties: PageProperties
    fields: string
  }
}

export interface PageElementProperties {
  pageObjectId: string
  size?: Dimension
  transform?: AffineTransform
}

export interface Dimension {
  width: Magnitude
  height: Magnitude
}

export interface Magnitude {
  magnitude: number
  unit: 'EMU' | 'PT'
}

export interface AffineTransform {
  scaleX?: number
  scaleY?: number
  shearX?: number
  shearY?: number
  translateX?: number
  translateY?: number
  unit?: 'EMU' | 'PT'
}

export interface TextRange {
  startIndex?: number
  endIndex?: number
  type?: 'FROM_START_INDEX' | 'FIXED_RANGE' | 'ALL'
}

export interface TextStyle {
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  smallCaps?: boolean
  fontSize?: Magnitude
  foregroundColor?: OptionalColor
  backgroundColor?: OptionalColor
  fontFamily?: string
  link?: Link
}

export interface OptionalColor {
  opaqueColor?: {
    rgbColor?: RgbColor
    themeColor?: string
  }
}

export interface RgbColor {
  red?: number
  green?: number
  blue?: number
}

export interface Link {
  url?: string
  slideIndex?: number
  pageObjectId?: string
  relativeLink?: 'NEXT_SLIDE' | 'PREVIOUS_SLIDE' | 'FIRST_SLIDE' | 'LAST_SLIDE'
}

export interface ShapeProperties {
  shapeBackgroundFill?: ShapeBackgroundFill
  outline?: Outline
  shadow?: Shadow
  link?: Link
}

export interface ShapeBackgroundFill {
  solidFill?: SolidFill
  propertyState?: 'RENDERED' | 'NOT_RENDERED' | 'INHERIT'
}

export interface SolidFill {
  color?: OpaqueColor
  alpha?: number
}

export interface OpaqueColor {
  rgbColor?: RgbColor
  themeColor?: string
}

export interface Outline {
  outlineFill?: OutlineFill
  weight?: Magnitude
  dashStyle?: string
  propertyState?: 'RENDERED' | 'NOT_RENDERED' | 'INHERIT'
}

export interface OutlineFill {
  solidFill?: SolidFill
}

export interface Shadow {
  type?: 'OUTER' | 'INNER'
  transform?: AffineTransform
  alignment?: 'TOP_LEFT' | 'TOP_CENTER' | 'TOP_RIGHT' | 'MIDDLE_LEFT' | 'MIDDLE_CENTER' | 'MIDDLE_RIGHT' | 'BOTTOM_LEFT' | 'BOTTOM_CENTER' | 'BOTTOM_RIGHT'
  color?: OpaqueColor
  alpha?: number
  blurRadius?: Magnitude
  propertyState?: 'RENDERED' | 'NOT_RENDERED' | 'INHERIT'
  rotateWithShape?: boolean
}

export interface PageProperties {
  pageBackgroundFill?: PageBackgroundFill
  colorScheme?: ColorScheme
}

export interface PageBackgroundFill {
  solidFill?: SolidFill
  propertyState?: 'RENDERED' | 'NOT_RENDERED' | 'INHERIT'
}

export interface ColorScheme {
  colors?: ThemeColorPair[]
}

export interface ThemeColorPair {
  type?: string
  color?: RgbColor
}