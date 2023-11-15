import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import multer from "multer";
import { v4 } from "uuid";

import { UserController } from "./user-controller";

import { Objects } from "../models/object-model";

export class ContentController {
    userController: UserController;

    constructor() {
        this.userController = new UserController();
    }

    addContent() {
        const storage = multer.diskStorage({
          destination: function (req, file, cb) {
            cb(null, './storage/objects/');
          },
          filename: function (req, file, cb) {
            const filename = v4() + file.originalname.slice(-4); 
            cb(null, filename);
          },
        });
    
        const upload = multer({ storage: storage });
    
        return upload.single('file');
    }
    
    handleContentUpload() {
        return async (req: Request, res: Response) => {
            try {
                this.userController.check();
          
                const { file, description, userID } = req.body;
          
                const filename = req.file?.filename;
          
                const newContent = new Objects();
                newContent.url = filename ? filename : 'none';
                newContent.description = description;
                newContent.post_date = new Date();
                newContent.user = userID;
          
                if (req.file?.mimetype === 'video/mp4') {
                  newContent.type = 'Video';
                } else {
                  newContent.type = 'Photo';
                }
          
                const savedContent = await newContent.save();
          
                if (!savedContent) {
                  return res.status(StatusCodes.BAD_REQUEST).json({
                    message: ReasonPhrases.BAD_REQUEST,
                  });
                }
          
                return res.status(StatusCodes.CREATED).json({
                  message: ReasonPhrases.CREATED,
                });
              } catch (error) {
                console.error(error);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                  message: ReasonPhrases.INTERNAL_SERVER_ERROR,
                });
              }
        };
    }
    
    getContent() {
        return async (req: Request, res: Response) => {
            this.userController.check();

            const broadcasts = await Objects.createQueryBuilder("content")
                .select()
                .where("user = :id", { id: req.query.userID })
                .orderBy("post_date", 'DESC')
                .getMany()

            res.status(StatusCodes.OK).json({
                message: ReasonPhrases.OK,
                data: broadcasts
            });
        };
    }

    updateContent() {
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

    deleteContent() {
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