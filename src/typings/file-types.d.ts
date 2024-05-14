// Import the `fnm` module
import fnm from 'fnm';

// Define a function to load a font file
export function loadFont(filePath: string): Buffer {
  // Use the `fnm` module to resolve the file path
  const fontFile = fnm.pathJoin(process.cwd(), filePath);

  // Read the font file as a Buffer
  const fontBuffer = fs.readFileSync(fontFile);

  // Return the font Buffer
  return fontBuffer;
}

// Declare a wildcard module for TTF font files
declare module '*.ttf' {
  const value: Buffer;
  export default value;
}


npm install fnm


yarn add fnm
