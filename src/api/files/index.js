import Express from "express";
import multer from "multer";
import { extname } from "path";
import {
  getArticles,
  getAuthors,
  saveArticlePic,
  saveAuthorsAvatars,
  writeArticles,
  writeAuthors,
} from "../../lib/fs-tools.js";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const filesRouter = Express.Router();
const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "U4-W1-D4-files-uploads/img",
    },
  }),
}).single("avatar");

filesRouter.post(
  "/:authorId/authorSingle",
  cloudinaryUploader,
  async (req, res, next) => {
    try {
      console.log("FILE:", req.file);
      console.log("BODY:", req.body);
      // const originalFileExtension = extname(req.file.originalname);
      // const fileName = req.params.authorId + originalFileExtension;
      // await saveAuthorsAvatars(fileName, req.file.buffer);
      const authorsArray = await getAuthors();
      const index = authorsArray.findIndex(
        (author) => author.id === req.params.authorId
      );
      if (index !== -1) {
        const oldAuthor = authorsArray[index];
        const updatedAuthor = {
          ...oldAuthor,
          avatar: `http://localhost:3001/img/authors/${fileName}`,
        };
        authorsArray[index] = updatedAuthor;
        await writeAuthors(authorsArray);
        res.send({ updatedAuthor, message: "file uploaded" });
      } else {
        next(
          createHttpError(
            404,
            `author with id ${req.params.authorId} not found!`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

filesRouter.post(
  "/:articleId/articleSingle",
  cloudinaryUploader,
  async (req, res, next) => {
    try {
      console.log("FILE:", req.file);
      console.log("BODY:", req.body);
      // const originalFileExtension = extname(req.file.originalname);
      // const fileName = req.params.articleId + originalFileExtension;
      await saveArticlePic(fileName, req.file.buffer);

      const articleArray = await getArticles();
      const index = articleArray.findIndex(
        (article) => article.id === req.params.articleId
      );
      if (index !== -1) {
        const oldArticle = articleArray[index];
        const newArticle = {
          ...oldArticle,
          cover: `http://localhost:3001/img/blogPosts/${fileName}`,
        };
        articleArray[index] = newArticle;
        await writeArticles(articleArray);
        res.send({ newArticle, message: "file uploaded" });
      } else {
        next(
          createHttpError(
            404,
            `article with id ${req.params.articleId} not found!`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

export default filesRouter;
