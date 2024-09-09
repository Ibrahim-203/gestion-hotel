const express = require("express")
const router = express.Router()
const db = require("../config/db")

router.get("/",(req,res)=>{
    const query = "SELECT * FROM client";

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
    const query = "SELECT * FROM typeRoom where id_type_room = ? ";

    db.query(query,[id],(err,results)=>{
        if(err){
            return res.status(500).send(err)
        }else{
            return res.status(200).send(results);
                        
        }
    })
})

router.delete("/:id",(req,res)=>{
    const id = req.params.id
    const query = "DELETE FROM client where id = ? ";

    db.query(query,[id],(err,results)=>{
        if(err){
            return res.status(500).send(err)
        }else{
            return res.status(200).send(`Suppression effectuée avec succèes.`);
                        
        }
    })
})

router.post("/",(req, res)=>{
    const {name,surname,date_naiss,lieu_naiss,pere,mere,profession,domicile,nationalite,piece_idtt,num_idtt,date_dlvr,lieu_dlvr} = req.body
    const query = "INSERT INTO `client`( `nom`, `prenom`, `date_naiss`, `lieu_naiss`, `pere`, `mere`, `proffession`, `domicile`, `nationalite`, `piece_idtt`, `num_idtt`, `date_dlvr`, `lieu_dlvr`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";
    db.query(query,[name,surname,date_naiss,lieu_naiss,pere,mere,profession,domicile,nationalite,piece_idtt,num_idtt,date_dlvr,lieu_dlvr], (err) => {
        if (err) {
          return res.status(500).send(err);
        }else{
            res.status(200).send(`Données insérés avec succès`);
        }
        
      });
    
})

module.exports = router