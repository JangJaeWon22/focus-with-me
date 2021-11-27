// const multer = require("multer");
import * as multer from "multer";
import * as multerS3 from "multer-s3";
import * as aws from "aws-sdk";
import { Request } from "express";

const s3 = new aws.S3();
// aws.config.loadFromPath(`${process.cwd()}/config/s3.js`);
class uploadMiddlewares {
  uploadAvatarS3 = multer({
    storage: multerS3({
      s3,
      bucket: "kkirri-images",
      acl: "public-read",
      key: (req, file, cb) => {
        console.log(file);
        cb(
          null,
          `uploads/avatar/${Date.now()}_${file.originalname
            .replace(/ /g, "")
            .trim()}`
        );
      },
    }),
  });
  uploadContentS3 = multer({
    storage: multerS3({
      s3,
      bucket: "kkirri-images",
      acl: " public-read",
      key: (req: Request, file, cb) => {
        cb(
          null,
          `uploads/content/${Date.now()}_${file.originalname
            .replace(/ /g, "")
            .trim()}`
        );
      },
    }),
  });
  uploadCoverS3 = multer({
    storage: multerS3({
      s3,
      bucket: "kkirri-images",
      acl: " public-read",
      key: (req: Request, files, cb) => {
        //여기서 분기처리 하면 되겠네
        if (files.fieldname === "coverOriginal")
          cb(
            null,
            `uploads/cover/${Date.now()}_${files.originalname
              .replace(/ /g, "")
              .trim()}`
          );
        else
          cb(
            null,
            `uploads/cropped/${Date.now()}_${files.originalname
              .replace(/ /g, "")
              .trim()}`
          );
      },
    }),
  });
  uploadTempS3 = multer({
    storage: multerS3({
      s3,
      bucket: "kkirri-images",
      acl: " public-read",
      key: (req: Request, file, cb) => {
        cb(
          null,
          `uploads/temp/${Date.now()}_${file.originalname
            .replace(/ /g, "")
            .trim()}`
        );
      },
    }),
  });
}

export default new uploadMiddlewares();
