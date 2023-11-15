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

interface UpdateRequest {
    userID: number;
    username: string;
    fullname: string;
    description: string;
    pp_url: string;
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

    update() {
        return async (req: Request, res: Response) => {
            const { userID, username, fullname, description, pp_url }: UpdateRequest = req.body;

            // Cek apakah username data sudah ada selain userID pada req body ...
            const existingUserWithUsername = await User.createQueryBuilder("user")
                .select(["user.userID", "user.username"])
                .where("user.username = :username", { username })
                .andWhere("user.userID != :id", { id: userID })
                .getOne();
            if (existingUserWithUsername) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: "Username already taken!",
                });
                return;
            }

            const status = await User.createQueryBuilder("user")
                    .update(User)
                    .set({ username: username, fullname: fullname, description: description, pp_url: pp_url })
                    .where("userID = :id", { id: userID})
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

    index() {
        return async (req: Request, res: Response) => {
            const limit = parseInt(req.query.perpage as string)
            const offset = (parseInt(req.query.page as string) - 1)*limit
            const users = await User.createQueryBuilder("user")
                .select(["user.userID", "user.fullname", "user.username", "user.description", "user.pp_url" ])
                .where(`fullname like '%${req.query.filter || req.query.filter?.toString()}%' or username like '%${req.query.filter || req.query.filter?.toString()}%'`)
                .cache(
                    `creator`,
                    cacheConfig.cacheExpirationTime
                )
                .limit(limit)
                .offset(offset)
                .getMany()

            res.status(StatusCodes.OK).json({
                message: ReasonPhrases.OK,
                data: users
            });
        };
    }

    info() {
        return async (req: Request, res: Response) => {
            this.check();

            const user = await User.createQueryBuilder("user")
                .select()
                .where("user.userID = :id", { id: req.query.userID })
                .getOne()

            const userObjectCount = await User.createQueryBuilder("user")
                .select("COUNT(object.objectID)", "objectCount")
                .leftJoin("user.objects", "object")
                .where("user.userID = :id", { id: req.query.userID })
                .getRawOne();
            
            const objectCount = userObjectCount ? userObjectCount.objectCount : 0;

            const userBroadcastCount = await User.createQueryBuilder("user")
                .select("COUNT(broadcast.objectID)", "broadcastCount")
                .leftJoin("user.bc", "broadcast")
                .where("user.userID = :id", { id: req.query.userID })
                .getRawOne();

            const broadcastCount = userBroadcastCount ? userBroadcastCount.broadcastCount : 0;

            res.status(StatusCodes.OK).json({
                message: ReasonPhrases.OK,
                data: {
                    user,
                    objectCount,
                    broadcastCount
                }
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
}
