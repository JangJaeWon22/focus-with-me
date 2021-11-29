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
exports.UserFactory = exports.User = void 0;
var sequelize_1 = require("sequelize");
var User = /** @class */ (function (_super) {
    __extends(User, _super);
    function User() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return User;
}(sequelize_1.Model));
exports.User = User;
function UserFactory(sequelize) {
    return sequelize.define('User', {
        userId: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: sequelize_1.DataTypes.INTEGER,
            unique: true
        },
        email: {
            type: sequelize_1.DataTypes.STRING(40),
            allowNull: true,
            unique: true
        },
        nickname: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false
        },
        password: {
            allowNull: true,
            type: sequelize_1.DataTypes.STRING
        },
        avatarUrl: {
            allowNull: true,
            type: sequelize_1.DataTypes.STRING
        },
        provider: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            defaultValue: "local"
        },
        snsId: {
            type: sequelize_1.DataTypes.STRING(30),
            allowNull: true
        },
        date: {
            allowNull: false,
            type: sequelize_1.DataTypes.DATE
        }
    }, {
        modelName: "User",
        timestamps: false,
        charset: "utf8",
        collate: "utf8_general_ci"
    });
}
exports.UserFactory = UserFactory;
;
