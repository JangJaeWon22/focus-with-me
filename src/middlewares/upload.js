"use strict";
exports.__esModule = true;
var multer_1 = require("multer");
var multer_s3_1 = require("multer-s3");
var aws = require("aws-sdk");
var dotenv_1 = require("dotenv");
dotenv_1["default"].config();
// import { Request } from "express";
var awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
};
var s3 = new aws.S3(awsConfig);
// aws.config.loadFromPath(`${process.cwd()}/config/s3.js`);
var uploadMiddlewares = /** @class */ (function () {
    function uploadMiddlewares() {
        this.uploadAvatarS3 = (0, multer_1["default"])({
            storage: (0, multer_s3_1["default"])({
                s3: s3,
                bucket: "kkirri-images",
                acl: "public-read",
                key: function (req, file, cb) {
                    console.log(file);
                    cb(null, "uploads/avatar/".concat(Date.now(), "_").concat(file.originalname
                        .replace(/ /g, "")
                        .trim()));
                }
            })
        });
        this.uploadContentS3 = (0, multer_1["default"])({
            storage: (0, multer_s3_1["default"])({
                s3: s3,
                bucket: "kkirri-images",
                acl: " public-read",
                key: function (req, file, cb) {
                    cb(null, "uploads/content/".concat(Date.now(), "_").concat(file.originalname
                        .replace(/ /g, "")
                        .trim()));
                }
            })
        });
        this.uploadCoverS3 = (0, multer_1["default"])({
            storage: (0, multer_s3_1["default"])({
                s3: s3,
                bucket: "kkirri-images",
                acl: " public-read",
                key: function (req, files, cb) {
                    //여기서 분기처리 하면 되겠네
                    if (files.fieldname === "coverOriginal")
                        cb(null, "uploads/cover/".concat(Date.now(), "_").concat(files.originalname
                            .replace(/ /g, "")
                            .trim()));
                    else
                        cb(null, "uploads/cropped/".concat(Date.now(), "_").concat(files.originalname
                            .replace(/ /g, "")
                            .trim()));
                }
            })
        });
        this.uploadTempS3 = (0, multer_1["default"])({
            storage: (0, multer_s3_1["default"])({
                s3: s3,
                bucket: "kkirri-images",
                acl: " public-read",
                key: function (req, file, cb) {
                    cb(null, "uploads/temp/".concat(Date.now(), "_").concat(file.originalname
                        .replace(/ /g, "")
                        .trim()));
                }
            })
        });
    }
    return uploadMiddlewares;
}());
exports["default"] = new uploadMiddlewares();
