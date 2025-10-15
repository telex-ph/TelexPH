// convert-to-webp.cjs
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const inputDir = "public/images";
const outputDir = "public/images";

const convertToWebP = async () => {
  const files = fs.readdirSync(inputDir);

  for (const file of files) {
    if (/\.(jpg|jpeg|png)$/i.test(file)) {
      const inputPath = path.join(inputDir, file);
      const outputPath = path.join(
        outputDir,
        path.parse(file).name + ".webp"
      );

      // Skip if already converted
      if (fs.existsSync(outputPath)) {
        console.log(`⚪ Skipped (already exists): ${file}`);
        continue;
      }

      await sharp(inputPath)
        .webp({ quality: 80 })
        .toFile(outputPath);

      console.log(`✅ Converted: ${file} → ${path.basename(outputPath)}`);
    }
  }
};

convertToWebP();
