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
            .get("/broadcast", this.broadcastController.getBroadcast())
            .put("/broadcast", this.broadcastController.updateBroadcast())
            .delete("/broadcast/:id", this.broadcastController.deleteBroadcast())
    }
}
