import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

import { UserController } from "./user-controller";
import { Comment } from "../models/comment-model";
import { Broadcast } from "../models/broadcast-model";
import { Like } from "../models/like-model";

export class BroadcastController {
    userController: UserController;

    constructor() {
        this.userController = new UserController();
    }

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

    addLike() {
        return async (req: Request, res: Response) => {
            const objectID = req.params['id'];
            const { user } = req.body;

            console.log(req.body);
            const bcitem = await Broadcast.createQueryBuilder("broadcast")
                .select()
                .where("broadcast.objectID = :id", { id: objectID })
                .getOne()

            if (!bcitem) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: ReasonPhrases.BAD_REQUEST,
                });
                return;
            }

            const newLike = new Like()
            newLike.bc = bcitem;
            newLike.type = 'Broadcast';
            newLike.user = user;

            const status = await newLike.save();
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
            const objectID = req.params['id'];
            const { description } = req.body;

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

    deleteBroadcast() {
        return async (req: Request, res: Response) => {
            this.userController.check();
            const objectID = req.params['id'];

            console.log(objectID);

            const status0 = await Comment.createQueryBuilder("like")
                    .delete()
                    .from(Comment)
                    .where({ bc: objectID })
                    .execute()

            if (!status0) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: ReasonPhrases.BAD_REQUEST,
                });
                return;
            }

            const status1 = await Like.createQueryBuilder("like")
                    .delete()
                    .from(Like)
                    .where({ bc: objectID })
                    .execute()

            if (!status1) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: ReasonPhrases.BAD_REQUEST,
                });
                return;
            }

            const status2 = await Broadcast.createQueryBuilder("broadcast")
                    .delete()
                    .from(Broadcast)
                    .where({ objectID: objectID })
                    .execute()

            if (!status2) {
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

    deleteComment() {
        return async (req: Request, res: Response) => {
            this.userController.check();
            const objectID = req.params['id'];

            console.log(objectID);

            const status1 = await Comment.createQueryBuilder("comment")
                    .delete()
                    .from(Comment)
                    .where({ commentID: objectID })
                    .execute()

            if (!status1) {
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

    deleteLike() {
        return async (req: Request, res: Response) => {
            this.userController.check();
            const id = req.params['id'];
            const user = req.params['name'];

            const status1 = await Like.createQueryBuilder("like")
                    .delete()
                    .from(Like)
                    .where({ bc: parseInt(String(id)), user: user, type: 'Broadcast' })
                    .execute()

            if (!status1) {
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

    getLike() {
        return async (req: Request, res: Response) => {
            this.userController.check();
            const objectID = req.params['id'];

            const objects = await Like.createQueryBuilder("like")
                .select("COUNT(*)")
                .where("like.bc = :id AND like.type = 'Broadcast'", { id: objectID })
                .getRawOne(); 

            res.status(StatusCodes.OK).json({
                message: ReasonPhrases.OK,
                data: objects
            });
        };
    }

    isLiked() {
        return async (req: Request, res: Response) => {
            this.userController.check();
            const { user, id } = req.query;

            const objects = await Like.createQueryBuilder("like")
                .select()
                .where("like.bc = :id AND like.user = :username AND like.type='Broadcast'", { id: parseInt(String(id)), username: user })
                .getOne(); 
            
            console.log(objects);

            res.status(StatusCodes.OK).json({
                message: ReasonPhrases.OK,
                data: objects
            });
        };
    }

    getComment() {
        return async (req: Request, res: Response) => {
            this.userController.check();
            const objectID = req.params['id'];

            const objects = await Comment.createQueryBuilder("comment")
                .select()
                .where("comment.bc = :id AND comment.type = 'Broadcast'", { id: objectID })
                .getMany(); 

            res.status(StatusCodes.OK).json({
                message: ReasonPhrases.OK,
                data: objects
            });
        };
    }
}