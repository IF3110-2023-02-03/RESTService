import express, { Express } from "express";
import cors from 'cors';
import { DataSource } from "typeorm";
import morgan from "morgan";
import "reflect-metadata";

import { serverConfig } from "./config/server-config";
import { dataConfig } from "./config/data-config";
import { UserRoute } from "./routes/user-route";
import { BroadcastRoute } from "./routes/broadcast-route";
import { SoapRoute } from "./routes/soap-route";
import { ContentRoute } from "./routes/content-route";

export class App {
    dataSource: DataSource;
    server: Express;

    constructor() {
        const userRoute = new UserRoute();
        const broadcastRoute = new BroadcastRoute();
        const soapRoute = new SoapRoute();
        const contentRoute = new ContentRoute();

        this.dataSource = new DataSource(dataConfig);

        this.server = express();
        this.server.use((cors as (options: cors.CorsOptions) => express.RequestHandler)({}));
        this.server.use('/objects', express.static('storage/objects'))
        this.server.use('/profiles', express.static('storage/profile'))
        this.server.use(
            "/api",
            express.json(),
            express.urlencoded({ extended: true }),
            morgan("combined"),
            userRoute.getRoute(),
            broadcastRoute.getRoute(),
            soapRoute.getRoute(),
            contentRoute.getRoute()
        );
    }

    run() {
        this.dataSource
            .initialize()
            .then(async () => {
                this.server.listen(serverConfig.port, () => {
                    console.log(
                        `Server is running on port: ${serverConfig.port}`
                    );
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }
}
