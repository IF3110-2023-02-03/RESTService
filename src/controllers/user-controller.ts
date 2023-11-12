import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import {
    AuthToken,
    AuthRequest,
} from "../middlewares/authentication-middleware";
import { cacheConfig } from "../config/cache-config";
import { jwtConfig } from "../config/jwt-config";
import { User } from "../models/user-model";
import { Broadcast } from "../models/broadcast-model";

interface TokenRequest {
    username: string;
    password: string;
}

interface StoreRequest {
    email: string;
    username: string;
    fullname: string;
    password: string;
}

export class UserController {
    token() {
        return async (req: Request, res: Response) => {
            const { username, password }: TokenRequest = req.body;
            if (!username || !password) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: ReasonPhrases.BAD_REQUEST,
                });
                return;
            }

            const user = await User.createQueryBuilder("user")
                .select(["user.userID", "user.password"])
                .where("user.username = :username", { username })
                .getOne();
            if (!user) {
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: "Invalid credentials",
                });
                return;
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: "Invalid credentials",
                });
                return;
            }

            const { userID } = user;
            const payload: AuthToken = {
                userID,
            };
            const token = jwt.sign(payload, jwtConfig.secret, {
                expiresIn: jwtConfig.expiresIn,
            });

            res.status(StatusCodes.OK).json({
                message: ReasonPhrases.OK,
                token,
                userID,
            });
        };
    }

    store() {
        return async (req: Request, res: Response) => {
            const { email, username, fullname, password }: StoreRequest = req.body;
            if (!email || !username || !fullname || !password) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: ReasonPhrases.BAD_REQUEST,
                });
                return;
            }

            const user = new User();
            user.email = email;
            user.username = username;
            user.fullname = fullname;
            user.password = password;
            user.description = "";
            user.pp_url = "";

            // Cek apakah data sudah ada ...
            const existingUserWithUsername = await User.findOneBy({
                username,
            });
            if (existingUserWithUsername) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: "Username already taken!",
                });
                return;
            }

            const existingUserWithEmail = await User.findOneBy({
                email,
            });
            if (existingUserWithEmail) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: "Email already taken!",
                });
                return;
            }

            const newUser = await user.save();
            if (!newUser) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: ReasonPhrases.BAD_REQUEST,
                });
                return;
            }

            const { userID } = newUser;
            const payload: AuthToken = {
                userID,
            };
            const token = jwt.sign(payload, jwtConfig.secret, {
                expiresIn: jwtConfig.expiresIn,
            });

            res.status(StatusCodes.CREATED).json({
                message: ReasonPhrases.CREATED,
                token,
            });
        };
    }

    index() {
        return async (req: Request, res: Response) => {

            const users = await User.createQueryBuilder("user")
                .select(["user.userID", "user.fullname"])
                .cache(
                    `creator`,
                    cacheConfig.cacheExpirationTime
                )
                .getMany()

            res.status(StatusCodes.OK).json({
                message: ReasonPhrases.OK,
                data: users
            });
        };
    }

    check() {
        return async (req: Request, res: Response) => {
            const { token } = req as AuthRequest;
            if (!token) {
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: ReasonPhrases.UNAUTHORIZED,
                });
                return;
            }

            res.status(StatusCodes.OK).json({
                userID: token.userID
            });
        };
    }

    addBroadcast() {
        return async (req: Request, res: Response) => {
            this.check();
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
            this.check();

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
            this.check();
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

    deleteBroadcast() {
        return async (req: Request, res: Response) => {
            this.check();
            const objectID = req.params['id'];

            console.log(objectID);

            const status = await Broadcast.createQueryBuilder("broadcast")
                    .delete()
                    .from(Broadcast)
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
