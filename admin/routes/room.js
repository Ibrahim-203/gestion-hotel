const express = require("express")
const router = express.Router()
const db = require("../config/db") 

router.get("/",(req,res)=>{
    const query = "SELECT r.`id_room`, r.`num_room`, t.`type`, t.`id_type_room`, t.`nbr_bed` FROM `room` r LEFT JOIN `typeroom` t ON t.id_type_room = r.type_room ORDER BY r.`num_room`;";

    db.query(query,(err,results)=>{
        if(err){
            return res.status(500).send("Erreur lors de la requête.")
        }else{
            return res.status(200).send(results);
                        
        }
    })
})

router.get("/:id",(req,res)=>{
    const id = req.params.id
    const query = "SELECT * FROM room where id = ? ";

    db.query(query,[id],(err,results)=>{
        if(err){
            return res.status(500).send(err)
        }else{
            return res.status(200).send(results);
                         
        } 
    })
})

router.get("/reservation/:id",(req,res)=>{ 
    const id = req.params.id
    const {dateDebut, dateFin} = req.query

    
    const query = "SELECT r.`id_room`, r.`num_room`, t.`type`, t.`id_type_room`, t.`nbr_bed`, b.date_arrive, b.date_depart FROM `room` r LEFT JOIN `typeroom` t ON t.id_type_room = r.type_room LEFT JOIN `book` b ON r.id_room = b.id_room WHERE t.nbr_bed >= ? AND r.id_room NOT IN ( SELECT b.id_room FROM `book` b WHERE b.date_arrive <= ? AND b.date_depart >= ? ) ";
    
    

    db.query(query,[id,dateFin,dateDebut],(err,results)=>{
        if(err){
            return res.status(500).send(err)
        }else{
            return res.status(200).send(results);
                         
        } 
    })
})

router.delete("/:id",(req,res)=>{
    const id = req.params.id
    const query = "DELETE FROM room where id_room = ? ";

    db.query(query,[id],(err,results)=>{
        if(err){
            return res.status(500).send(err)
        }else{
            return res.status(200).send(`Suppression effectuée avec succèes.`);
                        
        }
    })
})

router.post("/",(req, res)=>{ 
    const {num_room, type_room, nbr_bed} = req.body
    const query = "INSERT INTO `room`(`num_room`, `type_room`) VALUES (?,?)";
    db.query(query,[num_room, type_room], (err) => {
        if (err) {
          return res.status(500).send(err);
        }else{
            res.status(200).send(`Données insérés avec succès`);
        }
        
      });
    
})

router.put("/:id",(req, res)=>{
    const id = req.params.id;
    
    const {num_room,type_room, nbr_bed} = req.body;
    const query = "UPDATE `room` SET `num_room`= ? ,`type_room`= ? ,`nbr_bed`= ? WHERE `id_room` = ?";
    db.query(query,[num_room,type_room, nbr_bed, id], (err) => {
        if (err) {
          return res.status(500).send(err);
        }else{
            res.status(200).send(`Données insérés avec succès`);
        }
        
      });
    
})


module.exports = router