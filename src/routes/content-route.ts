import { Router } from "express";

import { AuthenticationMiddleware } from "../middlewares/authentication-middleware";
import { ContentController } from "../controllers/content-controller";

export class ContentRoute {
    authenticationMiddleware: AuthenticationMiddleware;
    broadcastController: ContentController;

    constructor() {
        this.authenticationMiddleware = new AuthenticationMiddleware();
        this.broadcastController = new ContentController();
    }

    getRoute() {
        return Router()
            .post("/content", this.broadcastController.addBroadcast())
            .get("/content", this.broadcastController.getContent())
            .put("/content/:id", this.broadcastController.updateBroadcast())
            .delete("/content/:id", this.broadcastController.deleteBroadcast())
    }
}
