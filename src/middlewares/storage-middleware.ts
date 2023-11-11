import { Request } from "express";
import { v4 as uuidv4 } from "uuid";
import * as path from "path";
import multer from "multer";

export class StorageMiddleware {
    upload(filename: string, fileType: "photo" | "video") {
        const storage = multer.diskStorage({
            destination: (
                req: Request,
                file: Express.Multer.File,
                callback: (error: Error | null, destination: string) => void
            ) => {
                const folderName = fileType === "photo" ? "photos" : "videos";
                const uploadPath = path.join(__dirname, "..", "..", "storage", folderName);
                callback(null, uploadPath);
            },
            filename: (
                req: Request,
                file: Express.Multer.File,
                callback: (error: Error | null, destination: string) => void
            ) => {
                const uniqueSuffix = uuidv4();
                const fileExtension = file.mimetype.split("/")[1];
                callback(null, `${uniqueSuffix}.${fileExtension}`);
            },
        });
        
        const upload = multer({ storage: storage });

        return upload.single(filename);
    }
}
