import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

import { Comment } from "../models/comment-model";
import { Like } from "../models/like-model";

export class FollowerController {
    updateUsername() {
        return async (req: Request, res: Response) => {
            const { oldUsername, newUsername } = req.body;
            
            const comments = await Comment.createQueryBuilder("comment")
                .where("comment.user = :oldUsername", { oldUsername })
                .getMany();
            const likes = await Like.createQueryBuilder("like")
                .where("like.user = :oldUsername", { oldUsername })
                .getMany();
            
            comments.forEach(async (comment) => {
                comment.user = newUsername;
                await comment.save();
            });
            likes.forEach(async (like) => {
                like.user = newUsername;
                await like.save();
            });

            return res.status(StatusCodes.OK).json({
                message: ReasonPhrases.OK,
            });
        }
    }
}