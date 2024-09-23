const express = require("express")
const db = require("./config/db")
const cors = require("cors")
const path = require('path');
const app = express()


const clientRouter = require("./routes/clients")
const bookRouter = require("./routes/book") 
const typeRoom = require("./routes/typeRoom")
const room = require("./routes/room")
const product = require("./routes/product")
const store = require("./routes/store")

app.use(cors()) 
app.use(express.json())
app.use("/client", clientRouter)
app.use("/book", bookRouter)
app.use("/typeRoom", typeRoom)
app.use("/product", product)
app.use("/room", room)
app.use("/store", store)
app.use('/getImages', express.static(path.join(__dirname, 'routes/uploads')))

app.get("/", (req, res)=>{
    console.log("here");
    res.sendStatus(200)
    
})

app.post('/upload', (req, res) => {
  // Logic for handling file upload
  res.send('File uploaded successfully');
})

app.post("/login", (req, res)=>{
  const {userName, password} = req.body
  if (userName ==='admin' && password === 'admin') {
    res.send({
      token:'1234'
    })
  }
});

app.get("/statistic", (req, res)=>{
    const query = 'SELECT (SELECT COUNT(*) FROM `book`) AS nbr_book, (SELECT COUNT(*) FROM `client`) AS nbr_client,(SELECT COUNT(*) FROM `room`) AS nbr_room, (SELECT COUNT(*) FROM `produit`) AS nbr_prod;';
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).send('Erreur lors de la requête.');
      }else{
        res.status(200).send(results)
      }
      
    });


    
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