import PdfPrinter from "pdfmake";

export const getPDFReadableStream = (article) => {
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
      {
        style: "tableExample",
        table: {
          body: [
            [
              "Title",
              "Category",
              "Reading time",
              "Author",
              "Created at",
              "Last Updated",
            ],
            [
              article.title,
              article.category,
              `${article.readTime.value} -
              ${article.readTime.unit}`,
              article.author.name,
              article.createdAt,
              article.updatedAt,
            ],
          ],
        },
      },
      //   {
      //     image: `data:image/jpeg;base64,/${article.cover}`,
      //     width: 200,
      //   },
    ],

    defaultStyle: {
      font: "Helvetica",
    },
  };

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition, {});
  pdfReadableStream.end();

  return pdfReadableStream;
};
