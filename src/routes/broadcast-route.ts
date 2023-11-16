import { Router } from "express";

import { AuthenticationMiddleware } from "../middlewares/authentication-middleware";
import { BroadcastController } from "../controllers/broadcast-controller";

export class BroadcastRoute {
    authenticationMiddleware: AuthenticationMiddleware;
    broadcastController: BroadcastController;

    constructor() {
        this.authenticationMiddleware = new AuthenticationMiddleware();
        this.broadcastController = new BroadcastController();
    }

    getRoute() {
        return Router()
            .post("/broadcast", this.broadcastController.addBroadcast())
            .post("/broadcast/like/:id", this.broadcastController.addLike())
            .post("/broadcast/comment/:id", this.broadcastController.addComment())
            .get("/broadcast", this.broadcastController.getBroadcast())
            .get("/broadcast/like/:id", this.broadcastController.getLike())
            .get("/broadcast/like", this.broadcastController.isLiked())
            .get("/broadcast/comment/:id", this.broadcastController.getComment())
            .get("/broadcast/comment", this.broadcastController.getCommentUser())
            .put("/broadcast/:id", this.broadcastController.updateBroadcast())
            .delete("/broadcast/:id", this.broadcastController.deleteBroadcast())
            .delete("/broadcast/like/:id/:name", this.broadcastController.deleteLike())
            .delete("/broadcast/comment/:id", this.broadcastController.deleteComment())
    }
}
