const { Jimp } = require('jimp');

async function removeBackground() {
  try {
    const inputPath = 'C:\\Users\\kidoskie\\.gemini\\antigravity\\brain\\661b198f-50ae-449f-928b-66c523b5b824\\media__1777635372100.jpg';
    const outputPath = 'public/hero-character.png';

    const image = await Jimp.read(inputPath);
    
    // Instead of raw bitmap data, we'll just scan and use getPixelColor / setPixelColor
    const w = image.bitmap.width;
    const h = image.bitmap.height;

    // Assuming top-left pixel is white background
    const bgColor = image.getPixelColor(0, 0);
    // get r,g,b from color
    const bgR = (bgColor >> 24) & 255;
    const bgG = (bgColor >> 16) & 255;
    const bgB = (bgColor >> 8) & 255;

    const threshold = 35; // slightly higher threshold for jpeg artifacts in white

    image.scan(0, 0, w, h, function(x, y, idx) {
      const red   = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue  = this.bitmap.data[idx + 2];

      const diff = Math.abs(red - bgR) + Math.abs(green - bgG) + Math.abs(blue - bgB);

      // Make pixels close to white transparent
      if (diff < threshold) {
        this.bitmap.data[idx + 3] = 0; // set alpha to 0
      }
    });

    await image.write(outputPath);
    console.log('Background removed successfully.');
  } catch (error) {
    console.error('Error removing background:', error);
  }
}

removeBackground();
