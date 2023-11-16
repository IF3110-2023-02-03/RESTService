import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import multer from "multer";
import { v4 } from "uuid";
import { unlink } from "fs";

import { UserController } from "./user-controller";

import { Objects } from "../models/object-model";
import { Like } from "../models/like-model";
import path from "path";

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

            const broadcasts = await Objects.createQueryBuilder("objects")
                .select()
                .where("objects.user = :id", { id: req.query.userID })
                .orderBy("objects.post_date", 'DESC')
                .getMany()

            res.status(StatusCodes.OK).json({
                message: ReasonPhrases.OK,
                data: broadcasts
            });
        };
    }

    getSource() {
        return async (req: Request, res: Response) => {
            this.userController.check();

            const name = req.params['name'];
            let options = {
                root: path.join(__dirname, '..', '..', 'storage', 'objects')
            }

            res.sendFile(name, options);
        };
    }

    updateContent() {
        return async (req: Request, res: Response) => {
            this.userController.check();
            const objectID = req.params['id'];
            const { description } = req.body;

            const status = await Objects.createQueryBuilder("objects")
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

    deleteSource() {
        return async (req: Request, res: Response) => {
            this.userController.check();

            const name = req.params['name'];
            let filepath =  path.join(__dirname, '..', '..', 'storage', 'objects') + '/' + name;

            unlink(filepath, function () {
                res.status(StatusCodes.OK).json({
                    message: ReasonPhrases.OK,
                });
            });
            
        };
    }

    getLike() {
        return async (req: Request, res: Response) => {
            this.userController.check();
            const objectID = req.params['id'];

            const objects = await Like.createQueryBuilder("like")
                .select("COUNT(*)")
                .where("like.object = :id", { id: objectID })
                .getRawOne(); 

            res.status(StatusCodes.OK).json({
                message: ReasonPhrases.OK,
                data: objects
            });
        };
    }
}