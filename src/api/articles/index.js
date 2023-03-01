import Express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
import createHttpError from "http-errors";
import { checkArticlesSchema, triggerBadRequest } from "./validation.js";

const articlesRouter = Express.Router();
const articlesJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "articles.json"
);
const getArticles = () => JSON.parse(fs.readFileSync(articlesJSONPath));
const writeArticles = (articleArray) => {
  fs.writeFileSync(articlesJSONPath, JSON.stringify(articleArray));
};

articlesRouter.post(
  "/",
  checkArticlesSchema,
  triggerBadRequest,
  (req, res, next) => {
    const newArticle = {
      ...req.body,
      id: uniqid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const articleArray = getArticles();
    articleArray.push(newArticle);
    writeArticles(articleArray);

    res.status(201).send({ id: newArticle.id });
  }
);

articlesRouter.get("/", (req, res, next) => {
  try {
    const articleArray = getArticles();
    if (req.query && req.query.category) {
      const filteredArticles = articleArray.filter(
        (article) => article.category === req.query.category
      );
      res.send(filteredArticles);
    } else {
      res.send(articleArray);
    }
  } catch (error) {
    next(error);
  }
});

articlesRouter.get("/:articleId", (req, res, next) => {
  try {
    const articleArray = getArticles();

    const chosenArticle = articleArray.find(
      (article) => article.id === req.params.articleId
    );
    if (chosenArticle) {
      res.send(foundBook);
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
});

articlesRouter.put(
  "/:articleId",
  checkArticlesSchema,
  triggerBadRequest,
  (req, res, next) => {
    try {
      const articleArray = getArticles();

      const index = articleArray.findIndex(
        (article) => article.id === req.params.articleId
      );
      if (index !== -1) {
        const oldArticle = articleArray[index];

        const newArticle = {
          ...oldArticle,
          ...req.body,
          updatedAt: new Date(),
        };

        articleArray[index] = newArticle;

        writeArticles(articleArray);

        res.send(newArticle);
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

articlesRouter.delete("/:articleId", (req, res, next) => {
  try {
    const articleArray = getArticles();

    const remainingArticles = articleArray.filter(
      (article) => article.id !== req.params.articleId
    );

    if (articleArray.length !== remainingArticles.length) {
      writeBooks(remainingBooks);

      res.status(204).send();
    } else {
      next(
        createHttpError(404, `Book with id ${req.params.articleId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});
export default articlesRouter;
