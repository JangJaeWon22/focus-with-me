"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
// require("dotenv").config();
require("dotenv/config");
// const aws = require("aws-sdk");
var aws = require("aws-sdk");
/**
 * - 파일 이동
 * - 파일 삭제
 * - 폴더 삭제
 */
var ControlS3 = /** @class */ (function () {
    function ControlS3() {
        this.s3 = new aws.S3();
    }
    ControlS3.prototype.extractImageSrcS3 = function (html) {
        try {
            var regexp = /<img[^>]+src\s*=\s*['"]([^'"]+)['"][^>]*>/g;
            var srcs = html.match(regexp);
            var imageList_1 = [];
            if (srcs) {
                srcs.forEach(function (src) {
                    var imageUrl = "uploads" + src.split("uploads")[1].slice(0, -2);
                    imageList_1.push(imageUrl);
                });
            }
            return imageList_1;
        }
        catch (error) {
            console.log(error);
            return [];
        }
    };
    ControlS3.prototype.copyImagesS3 = function (imageList) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, imageList_2, url, filename, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        _i = 0, imageList_2 = imageList;
                        _a.label = 1;
                    case 1:
                        if (!(_i < imageList_2.length)) return [3 /*break*/, 4];
                        url = imageList_2[_i];
                        filename = url.split("temp/")[1];
                        return [4 /*yield*/, this.s3
                                .copyObject({
                                Bucket: process.env.S3_BUCKET_NAME,
                                CopySource: "kkirri-images/".concat(url),
                                Key: "uploads/content/".concat(filename),
                                ACL: "public-read"
                            })
                                .promise()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                    case 5:
                        error_1 = _a.sent();
                        console.log(error_1);
                        return [2 /*return*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * root 이 후의 경로가 Key
     * temp/1636955398064_20170716_211848140_iOS.jpg
     */
    // 배열까지 처리할 수 있도록 만들어보기
    ControlS3.prototype.removeObjS3 = function (src) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.s3
                                .deleteObject({
                                Bucket: process.env.S3_BUCKET_NAME,
                                Key: src
                            })
                                .promise()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.log(error_2);
                        return [2 /*return*/];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ControlS3.prototype.emptyTempS3 = function () {
        return __awaiter(this, void 0, void 0, function () {
            var listParams, listedObjects, deleteParams;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        listParams = {
                            Bucket: process.env.S3_BUCKET_NAME,
                            Prefix: "uploads/temp"
                        };
                        return [4 /*yield*/, this.s3.listObjectsV2(listParams).promise()];
                    case 1:
                        listedObjects = _a.sent();
                        // 폴더 내 파일이 없으면 함수 종료
                        if (listedObjects.Contents.length === 0)
                            return [2 /*return*/];
                        deleteParams = {
                            Bucket: process.env.S3_BUCKET_NAME,
                            Delete: { Objects: [] }
                        };
                        listedObjects.Contents.forEach(function (_a) {
                            var Key = _a.Key;
                            deleteParams.Delete.Objects.push({ Key: Key });
                        });
                        return [4 /*yield*/, this.s3.deleteObjects(deleteParams).promise()];
                    case 2:
                        _a.sent();
                        if (!listedObjects.IsTruncated) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.emptyTempS3()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ControlS3.prototype.getObjS3 = function (src) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.s3
                                .getObject({
                                Bucket: process.env.S3_BUCKET_NAME,
                                Key: src
                            })
                                .promise()];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 2:
                        error_3 = _a.sent();
                        console.log(error_3);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return ControlS3;
}());
// 다른 곳에서 import하면 여기서 인스턴스를 만들어준다?
exports["default"] = new ControlS3();
