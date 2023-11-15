import { Router } from "express";

import { AuthenticationMiddleware } from "../middlewares/authentication-middleware";
import { ContentController } from "../controllers/content-controller";

export class ContentRoute {
    authenticationMiddleware: AuthenticationMiddleware;
    contentController: ContentController;

    constructor() {
        this.authenticationMiddleware = new AuthenticationMiddleware();
        this.contentController = new ContentController();
    }

    getRoute() {
        return Router()
            .post("/content", this.contentController.addContent(), this.contentController.handleContentUpload())
            .get("/content", this.contentController.getContent())
            .get("/content/:name", this.contentController.getSource())
            .put("/content/:id", this.contentController.updateContent())
            .delete("/content/:id", this.contentController.deleteContent())
    }
}
