const express = require("express")
const db = require("./config/db")
const cors = require("cors")
const app = express()


const clientRouter = require("./routes/clients")
const bookRouter = require("./routes/book")
const typeRoom = require("./routes/typeRoom")

app.use(cors())
app.use(express.json())
app.use("/client", clientRouter)
app.use("/book", bookRouter)
app.use("/typeRoom", typeRoom)

app.get("/", (req, res)=>{
    console.log("here");
    res.sendStatus(200)
    
})


app.get("/test", (req, res)=>{
    const query = 'SELECT 1 + 1 AS solution';
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).send('Erreur lors de la requête.');
      }
      res.send(`La solution est : ${results[0].solution}`);
    });
    
})


app.listen(3001)