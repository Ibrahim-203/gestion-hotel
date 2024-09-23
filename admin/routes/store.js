const express = require("express")
const router = express.Router()
const db = require("../config/db") 

router.get("/", (req, res)=>{

  const query = "SELECT G.`id_vente_g`,CONCAT(c.nom,' ', c.prenom) as `client` ,G.`total_vente`,G.`date_vente`,G.`status` FROM `vente_groupe` G LEFT JOIN `client` C ON G.id_client = C.id; "
    
  db.query(query,(err,results)=>{
    if(err){
        return res.status(500).send(err)
    }else{
        return res.status(200).send(results);
                     
    } 
})
})

router.get("/prod/:id", (req, res)=>{
    const id = req.params.id

    const query = "SELECT P.libelle_prod,D.quantite_prod, D.prix_total FROM `vente_detail` D LEFT JOIN `produit` P ON D.id_prod = P.id_prod LEFT JOIN `vente_groupe` G ON G.id_vente_g = D.id_vente_g WHERE D.id_vente_g = ?;"
      
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

router.get("/client", (req, res)=>{
    const query = "SELECT b.*, CONCAT(c.nom,' ', c.prenom) AS client FROM `book` b LEFT JOIN `client` c ON b.id_client = c.id GROUP BY b.id_client; "
    
    db.query(query,(err,results)=>{
      if(err){
          return res.status(500).send(err)
      }else{
          return res.status(200).send(results);
                       
      } 
  })
})

router.post("/", (req, res) => {
    const { infoClient, listPanier, total } = req.body;

    db.beginTransaction((err) => {
        if (err) {
            return res.status(500).send("Erreur lors de la transaction.");
        }

        // 1. Insérer dans vente_groupe
        const venteGroupeQuery = `INSERT INTO vente_groupe (id_client, id_book, total_vente) VALUES (?, ?, ?)`;
        db.execute(venteGroupeQuery, [
            infoClient[0].id_client,
            infoClient[0].id_book,
            total
        ], (err, result) => {
            if (err) {
                return db.rollback(() => {
                    console.error('Erreur lors de l\'insertion dans vente_groupe:', err);
                    return res.status(500).send("Erreur lors de l'insertion dans vente_groupe.");
                });
            }

            const idVenteGroupe = result.insertId; // Récupérer l'ID de vente_groupe

            // 2. Insérer dans vente_detail pour chaque produit du panier
            const venteDetailQuery = `INSERT INTO vente_detail (id_vente_g, id_prod, quantite_prod, prix_total) VALUES ?`;
            const venteDetailsValues = listPanier.map(item => [
                idVenteGroupe, item.id_prod, item.quantite, item.total
            ]);

            db.query(venteDetailQuery, [venteDetailsValues], (err) => {
                if (err) {
                    return db.rollback(() => {
                        console.error('Erreur lors de l\'insertion dans vente_detail:', err);
                        return res.status(500).send("Erreur lors de l'insertion dans vente_detail.");
                    });
                }

                // 3. Valider la transaction
                db.commit((err) => {
                    if (err) {
                        return db.rollback(() => {
                            console.error('Erreur lors de la validation de la transaction:', err);
                            return res.status(500).send("Erreur lors de la validation de la transaction.");
                        });
                    }

                    console.log('Transaction réussie et les données ont été insérées.');
                    return res.status(201).send("Données insérées avec succès.");
                });
            });
        });
    });
});

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


