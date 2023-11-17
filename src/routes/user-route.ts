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
            .post("/user/profile", this.userController.addContent(), this.userController.handleContentUpload())
            .put("/user", this.userController.update())
            .get("/user", this.userController.index())
            .get("/user/profile/:name", this.userController.getSource())
            .get("/user/info", this.userController.info())
            .get("/get-followers-count", 
                this.authenticationMiddleware.authenticate(), 
                this.userController.getFollowersCount())
            .get(
                "/user/check", 
                this.authenticationMiddleware.authenticate(),
                this.userController.check()
            )
    }
}
