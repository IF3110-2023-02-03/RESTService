import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

import { UserController } from "./user-controller";

import { Objects } from "../models/object-model";

export class ContentController {
    userController: UserController;

    constructor() {
        this.userController = new UserController();
    }

    addBroadcast() {
        return async (req: Request, res: Response) => {
            this.userController.check();
            const { description, userID } = req.body;

            const newBroadcast = new Objects()
            newBroadcast.description = description;
            newBroadcast.post_date = new Date()
            newBroadcast.user = userID

            const status = await newBroadcast.save();
            if (!status) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: ReasonPhrases.BAD_REQUEST,
                });
                return;
            }

            res.status(StatusCodes.CREATED).json({
                message: ReasonPhrases.CREATED,
            });
        };
    }

    getContent() {
        return async (req: Request, res: Response) => {
            this.userController.check();

            const broadcasts = await Objects.createQueryBuilder("broadcast")
                .select()
                .where("broadcast.user = :id", { id: req.query.userID })
                .orderBy("broadcast.post_date", 'DESC')
                .getMany()

            res.status(StatusCodes.OK).json({
                message: ReasonPhrases.OK,
                data: broadcasts
            });
        };
    }

    updateBroadcast() {
        return async (req: Request, res: Response) => {
            this.userController.check();
            const objectID = req.params['id'];
            const { description } = req.body;

            const status = await Objects.createQueryBuilder("broadcast")
                    .update(Objects)
                    .set({ description: description })
                    .where("objectID = :id", { id: objectID})
                    .execute()

            if (!status) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: ReasonPhrases.BAD_REQUEST,
                });
                return;
            }

            res.status(StatusCodes.OK).json({
                message: ReasonPhrases.OK,
            });
        };
    }

    deleteBroadcast() {
        return async (req: Request, res: Response) => {
            this.userController.check();
            const objectID = req.params['id'];

            console.log(objectID);

            const status = await Objects.createQueryBuilder("broadcast")
                    .delete()
                    .from(Objects)
                    .where({ objectID: objectID })
                    .execute()

            if (!status) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: ReasonPhrases.BAD_REQUEST,
                });
                return;
            }

            res.status(StatusCodes.OK).json({
                message: ReasonPhrases.OK,
            });
        };
    }
}