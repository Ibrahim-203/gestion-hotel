const express = require("express")
const router = express.Router()

router.get("/", (req, res)=>{
    res.send("List of book")
})

router.get("/new", (req, res)=>{
    res.send("Create a new book")
})

module.exports = router


