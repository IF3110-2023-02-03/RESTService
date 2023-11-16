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
            .post("/content/like/:id", this.contentController.addLike())
            .get("/content", this.contentController.getContent())
            .get("/content/src/:name", this.contentController.getSource())
            .get("/content/like/:id", this.contentController.getLike())
            .get("/content/like", this.contentController.isLiked())
            .get("/content/comment/:id", this.contentController.getComment())
            .put("/content/:id", this.contentController.updateContent())
            .delete("/content/:id", this.contentController.deleteContent())
            .delete("/content/comment/:id", this.contentController.deleteComment())
            .delete("/content/like/:id/:name", this.contentController.deleteLike())
            .delete("/content/src/:name", this.contentController.deleteSource())
    }
}
