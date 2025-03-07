import { create } from 'domain';
import { Router } from 'express';
import AuthosController from '../controllers/AuthorsController';

const authorRouter = Router();

const authosController = new AuthosController()

authorRouter.post("/", authosController.create)
authorRouter.get("/", authosController.getAll)
authorRouter.get("/:id", authosController.getById)
authorRouter.put("/:id", authosController.put)
authorRouter.delete("/", authosController.delete)
authorRouter.get("/:mes", authosController.autoresMes)  

export default authorRouter;