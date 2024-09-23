const express = require("express")
const router = express.Router()
const db = require("../config/db") 

router.get("/", (req, res)=>{

  const query = "SELECT b.*, CONCAT(c.nom,' ', c.prenom) as clients, r.num_room FROM `book` b LEFT JOIN `client` c ON b.id_client = c.id LEFT JOIN `room` r ON b.id_room = r.id_room;"
    
  db.query(query,(err,results)=>{
    if(err){
        return res.status(500).send(err)
    }else{
        return res.status(200).send(results);
                     
    } 
})
})
router.get("/home/:id", (req, res)=>{

  const id = req.params.id

  const query = "SELECT b.*, CONCAT(c.nom,' ', c.prenom) as clients, r.num_room FROM `book` b LEFT JOIN `client` c ON b.id_client = c.id LEFT JOIN `room` r ON b.id_room = r.id_room WHERE b.id_room = ?"
    
  db.query(query,[id],(err,results)=>{
    if(err){
        return res.status(500).send(err)
    }else{
        return res.status(200).send(results);
                     
    } 
})
})

router.get("/new", (req, res)=>{
    res.send("Create a new book")
})


router.post("/",(req, res)=>{ 
  const {client,room , nbr_client, date_arrive, date_depart} = req.body
  const query = "INSERT INTO `book`(`id_room`, `id_client`, `nbr_client`,`date_arrive`, `date_depart`) VALUES (?,?,?,?,?)";
  db.query(query,[room,client, nbr_client, date_arrive, date_depart], (err) => {
      if (err) {
        return res.status(500).send(err);
      }else{
          res.status(200).send(`Données insérés avec succès`);
      }
      
    });
  
})

router.put("/:id",(req, res)=>{
    const {} = req.body;
    const query = "";
    db.query(query,[], (err) => {
        if (err) {
          return res.status(500).send(err);
        }else{
            res.status(200).send(`Données insérés avec succès`);
        }
        
      });
    
})

module.exports = router


