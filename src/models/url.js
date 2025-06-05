const {DataTypes } = require('sequelize');
const sequelize = require('../db');

const Url=sequelize.define('Url', 
    {
        originalUrl:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        shortId:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        clickCount:{
            type: DataTypes.INTEGER,
            default: 0,
        },
        creationDate:{
            type: DataTypes.DATE,
            allowNull: false,
        }
    }
);

console.log("[DEBUG] Url model: ", Url)
module.export = Url;