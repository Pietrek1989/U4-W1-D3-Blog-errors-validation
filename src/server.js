import Express from "express";
import listEndpoints from "express-list-endpoints";
import articlesRouter from "./api/articles/index.js";
import {
  genericErrorHandler,
  badRequestHandler,
  unauthorizedHandler,
  notfoundHandler,
} from "./errorsHandlers.js";
import cors from "cors";

const server = Express();
const port = 3001;
server.use(cors());
server.use(Express.json());
server.use("/articles", articlesRouter);

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notfoundHandler);
server.use(genericErrorHandler);
server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`Server is running on port ${port}`);
});
