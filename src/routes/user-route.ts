import { Router } from "express";

import { AuthenticationMiddleware } from "../middlewares/authentication-middleware";
import { UserController } from "../controllers/user-controller";

export class UserRoute {
    authenticationMiddleware: AuthenticationMiddleware;
    userController: UserController;

    constructor() {
        this.authenticationMiddleware = new AuthenticationMiddleware();
        this.userController = new UserController();
    }

    getRoute() {
        return Router()
            .post("/user/token", this.userController.token())
            .post("/user", this.userController.store())
            .get("/user", this.userController.index())
            .post("/broadcast", this.userController.addBroadcast())
            .get("/broadcast", this.userController.getBroadcast())
            .get(
                "/user/check", 
                this.authenticationMiddleware.authenticate(),
                this.userController.check()
            )
    }
}
