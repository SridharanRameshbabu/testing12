const {DataTypes} = require('sequelize')
const sequelize = require('../config/db')

const HireWithUs = sequelize.define("HireWithUs",{
    companyName:{
        type:DataTypes.STRING,
        allowNull:false
    },
    companyEmail:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    companyPhone:{
        type:DataTypes.STRING,
        allowNull:false
    },
    domain:{
        type:DataTypes.STRING,
        allowNull:false
    },
    numofstudents:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
})

module.exports = HireWithUs