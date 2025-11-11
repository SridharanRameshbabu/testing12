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
        unique:false
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
    },
    experienceLevel:{
        type:DataTypes.STRING,
        allowNull:true
    },
    message:{
        type:DataTypes.STRING,
        allowNull:true
    }
})

module.exports = HireWithUs