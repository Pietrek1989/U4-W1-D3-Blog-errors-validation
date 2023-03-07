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
  //   const response = await fetch(article.cover);
  //   const imageData = await response.arrayBuffer();

  const docDefinition = {
    content: [article.title, article.category],

    defaultStyle: {
      font: "Helvetica",
    },
  };

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition, {});
  pdfReadableStream.end();

  return pdfReadableStream;
};
