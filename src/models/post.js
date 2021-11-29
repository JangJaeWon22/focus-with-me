"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.PostFactory = exports.Post = void 0;
var sequelize_1 = require("sequelize");
var Post = /** @class */ (function (_super) {
    __extends(Post, _super);
    function Post() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Post;
}(sequelize_1.Model));
exports.Post = Post;
function PostFactory(sequelize) {
    return sequelize.define('Post', {
        postId: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: sequelize_1.DataTypes.INTEGER,
            unique: true
        },
        coverOriginal: {
            type: sequelize_1.DataTypes.STRING
        },
        coverCropped: {
            type: sequelize_1.DataTypes.STRING
        },
        title: {
            allowNull: false,
            type: sequelize_1.DataTypes.STRING
        },
        categorySpace: {
            type: sequelize_1.DataTypes.STRING
        },
        categoryStudyMate: {
            type: sequelize_1.DataTypes.STRING
        },
        categoryInterest: {
            type: sequelize_1.DataTypes.STRING
        },
        contentEditor: {
            type: sequelize_1.DataTypes.TEXT
        },
        date: {
            allowNull: false,
            type: sequelize_1.DataTypes.DATE
        }
    }, {
        modelName: "Post",
        timestamps: false,
        charset: "utf8",
        collate: "utf8_general_ci"
    });
}
exports.PostFactory = PostFactory;
;
