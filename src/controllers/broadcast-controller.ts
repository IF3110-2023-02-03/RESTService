import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

import { UserController } from "./user-controller";

import { Broadcast } from "../models/broadcast-model";

export class BroadcastController {
    userController: UserController;

    addBroadcast() {
        return async (req: Request, res: Response) => {
            this.userController.check();
            const { description, userID } = req.body;

            const newBroadcast = new Broadcast()
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

    getBroadcast() {
        return async (req: Request, res: Response) => {
            this.userController.check();

            const broadcasts = await Broadcast.createQueryBuilder("broadcast")
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
            const { description, objectID } = req.body;

            const status = await Broadcast.createQueryBuilder("broadcast")
                    .update(Broadcast)
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
}