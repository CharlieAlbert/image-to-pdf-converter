const fs = require("fs");
const { PDFDocument, rgb } = require("pdf-lib");

async function convertImageToPdf(imagePath, pdfPath) {
  /* Read the image file asynchronously */
  const image = await fs.promises.readFile(imagePath);

  /* Create a new pdf file */
  const pdfDoc = await PDFDocument.create();

  const page = pdfDoc.addPage([400, 400]);

  const imageEmbed = await pdfDoc.embedJpg(image);

  /* Scaling the image to fit within page dimensions */
  const { width, height } = imageEmbed.scaleToFit(
    page.getWidth(),
    page.getHeight()
  );

  page.drawImage(imageEmbed, {
    x: page.getWidth() / 2 - width / 2,
    y: page.getHeight() / 2 - height / 2,
    width,
    height,
    color: rgb(0, 0, 0),
  });

  /* Saving the PDF document as bytes */
  const pdfBytes = await pdfDoc.save();

  /* write the bytes to a file asynchronously */
  await fs.promises.writeFile(pdfPath, pdfBytes);
}

convertImageToPdf("./carbon/convert.jpg", "output.pdf")
  .then(() => {
    console.log("Image converted to pdf successfully");
  })
  .catch((error) => {
    console.log("Error converting image", error);
  });
