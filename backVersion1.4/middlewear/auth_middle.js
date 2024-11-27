const express = require("express")
const jwt = require("jsonwebtoken")
const secretkey = process.env.rtoken
const user = require("../model/user")

const verifyToken = (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) 
        return res.status(401).json({
            error: "access denied"
        
        });
    

    try {
        const decoded = jwt.verify(token, secretkey);
        req.user = decoded;//user true vallide
        next();

    } catch (error) {
         res.status(400).json({
            error: "token is not valid",
            
        })
    }


}

module.exports = verifyToken