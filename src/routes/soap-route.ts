import { Router } from "express";

import { AuthenticationMiddleware } from "../middlewares/authentication-middleware";
import { SOAPMiddleware } from "../middlewares/soap-middleware";
import { SoapController } from "../controllers/soap-controller";

export class SoapRoute {
    authenticationMiddleware: AuthenticationMiddleware;
    soapController: SoapController;
    soapMiddleware: SOAPMiddleware;

    constructor() {
        this.authenticationMiddleware = new AuthenticationMiddleware();
        this.soapController = new SoapController();
        this.soapMiddleware = new SOAPMiddleware();
    }

    getRoute() {
        return Router()
            .post("/follow/accept",
            this.authenticationMiddleware.authenticate(),
            this.soapController.accept())
            .post("/follow/reject", 
            this.authenticationMiddleware.authenticate(),
            this.soapController.reject())
            .get(
                "/follow",
                this.authenticationMiddleware.authenticate(),
                this.soapController.index()
            )
            .get(
                "/follow-count",
                this.authenticationMiddleware.authenticate(),
                this.soapController.index()
            )
            .get(
                "/pending-follow",
                this.authenticationMiddleware.authenticate(),
                this.soapController.indexPending()
            )
            .post(
                "/contents",
                this.soapController.contents()
            )
            .put(
                "/update-username",
                this.soapController.updateUsername()
            )
            .put(
                "/update-fullname",
                this.soapController.updateFullname()
            )
    }
}
