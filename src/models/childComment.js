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
exports.ChildCommentFactory = exports.ChildComment = void 0;
var sequelize_1 = require("sequelize");
var ChildComment = /** @class */ (function (_super) {
    __extends(ChildComment, _super);
    function ChildComment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ChildComment;
}(sequelize_1.Model));
exports.ChildComment = ChildComment;
function ChildCommentFactory(sequelize) {
    return sequelize.define('ChildComment', {
        childCommentId: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: sequelize_1.DataTypes.INTEGER,
            unique: true
        },
        textContent: {
            allowNull: false,
            type: sequelize_1.DataTypes.STRING
        },
        date: {
            allowNull: false,
            type: sequelize_1.DataTypes.DATE
        }
    }, {
        modelName: "ChildComment",
        timestamps: false,
        charset: "utf8",
        collate: "utf8_general_ci"
    });
}
exports.ChildCommentFactory = ChildCommentFactory;
;
