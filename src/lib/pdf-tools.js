import PdfPrinter from "pdfmake";

export const getPDFReadableStream = async (article) => {
  // Define font files
  const fonts = {
    Helvetica: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      italics: "Helvetica-Oblique",
      bolditalics: "Helvetica-BoldOblique",
    },
  };
  const printer = new PdfPrinter(fonts);

  const docDefinition = {
    content: [
      article.title,
      article.category,
      {
        image: article.cover,
        width: 200,
      },
    ],

    defaultStyle: {
      font: "Helvetica",
    },
  };

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition, {});
  const chunks = [];
  pdfReadableStream.on("data", (chunk) => {
    chunks.push(chunk);
  });
  pdfReadableStream.on("end", () => {
    const pdfBuffer = Buffer.concat(chunks);
    return pdfBuffer;
  });
};
