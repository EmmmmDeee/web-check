// Define a type for the color object properties
type ColorObjectProperty = {
  readonly [key: string]: string;
};

// Define a type for the color object, specifying the property keys and values
type ColorObject = ColorObjectProperty & {
  primary: string;
  primaryLighter: string;
  textColor: string;
  textColorSecondary: string;
  background: string;
  backgroundDarker: string;
  backgroundLighter: string;
  bgShadowColor: string;
  fgShadowColor: string;
  primaryTransparent: string;
  // Action Colors
  info: string;
  success: string;
  warning: string;
  error: string;
  danger: string;
  neutral: string;
};

// Initialize the color object with the specified properties
const colors: ColorObject = {
  primary: '#9fef00',
  primaryLighter: '#cff97a',
  textColor: '#ffffff',
  textColorSecondary: '#a4b1cd',
  background: '#141d2b',
  backgroundDarker: '#111927',
  backgroundLighter: '#1a2332',
  bgShadowColor: '#0f1620',
  fgShadowColor: '#456602',
  primaryTransparent: '#9fef0012',
  // Action Colors
  info: '#04e4f4',
  success: '#20e253',
  warning: '#f6f000',
  error: '#fca016',
  danger: '#f80363',
  neutral: '#272f4d',
};

// Export the color object as the default export
export default colors;
