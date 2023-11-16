import { Router } from "express";

import { FollowerController } from "../controllers/follower-controller";

export class FollowerRoute {
    followerController: FollowerController;

    constructor() {
        this.followerController = new FollowerController();
    }

    getRoute() {
        return Router()
            .put("/follower", this.followerController.updateUsername())
    }
}