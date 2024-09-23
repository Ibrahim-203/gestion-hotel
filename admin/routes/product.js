const express = require("express")
const router = express.Router()
const db = require("../config/db")
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Chemin du dossier de destination
const uploadDir = path.join(__dirname, 'uploads');

// Vérifier si le dossier existe, sinon le créer
if (!fs.existsSync(uploadDir)) { 
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configurer multer pour stocker les fichiers dans le dossier
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Utiliser le dossier créé ou existant
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({ storage: storage });

// Request to get all data 
router.get("/",(req,res)=>{
    const query = "select * from produit order by libelle_prod";

    db.query(query,(err,results)=>{
        if(err){
            return res.status(500).send("Erreur lors de la requête.")
        }else{
            return res.status(200).send(results);
                        
        }
    })
})

// Request to get specific data 
router.get("/:id",(req,res)=>{
    const id = req.params.id
    const query = "SELECT * FROM product where id = ? ";

    db.query(query,[id],(err,results)=>{
        if(err){
            return res.status(500).send(err)
        }else{
            return res.status(200).send(results);
                         
        }
    })
})

// Request to delete data 
router.delete("/:id",(req,res)=>{
    const id = req.params.id
    const filepath = "./routes/uploads/"+ req.query.filename
    const query = "DELETE FROM produit where id_prod = ? ";
    fs.unlink(filepath,(err)=>{
        if(err){
            console.error("Impossible de supprimer le fichier image : ", err);
            return;
        }
    })


        db.query(query,[id],(err,results)=>{
        if(err){
            return res.status(500).send(err)
        }else{
            return res.status(200).send(`Suppression effectuée avec succèes.`);
                        
        }
    })
    
})

// Request to add data 
router.post("/", (req, res) => {
    upload.single('image')(req, res, function (err) {
        if (err) {
            return res.status(500).send("Erreur lors de l'upload du fichier.");
        }

        const libelle_prod = req.body.libelle_prod;
        const prix_unit = req.body.prix_unit;
        let filename = null;

        if (req.file) {
            filename = req.file.filename; // Si un fichier a été téléchargé, on récupère le nom
        }

        let query;
        let params;

        if (filename) {
            // Si une image est présente
            query = "INSERT INTO `produit`(`libelle_prod`, `prix_unit`, `image`) VALUES (?, ?, ?)";
            params = [libelle_prod, prix_unit, filename];
        } else {
            // Si aucune image n'est fournie
            query = "INSERT INTO `produit`(`libelle_prod`, `prix_unit`) VALUES (?, ?)";
            params = [libelle_prod, prix_unit];
        }

        db.query(query, params, (err) => {
            if (err) {
                return res.status(500).send(err);
            } else {
                res.status(200).send("Données insérées avec succès");
            }
        });
    });
});


// Request to update data 
router.put("/:id",(req, res)=>{
    
    upload.single('image')(req, res, function (err) {
        if (err) {
            return res.status(500).send("Erreur lors de l'upload du fichier.");
        }
        const id = req.params.id;
        const {libelle_prod, prix_unit} = req.body
        
        let query = "UPDATE `produit` SET `libelle_prod`= ? ,`prix_unit`= ? WHERE id_prod = ?";
        params = [libelle_prod, prix_unit, id]

        if(req.file){
            
            const oldImage = "./routes/uploads/"+ req.query.oldImage
            const filename = req.file.filename
            query = "UPDATE `produit` SET `libelle_prod`= ? ,`prix_unit`= ?,`image`= ? WHERE id_prod = ?";
            params = [libelle_prod, prix_unit,filename, id]

        if(fs.existsSync(oldImage)){
            fs.unlink(oldImage,(err)=>{
        if(err){
            console.error("Impossible de supprimer le fichier image : ", err);
            return;
        }

        })
        } 
    }

    db.query(query, params, (err) => {
        if (err) {
            return res.status(500).send(err);
        } else {
            res.status(200).send("Données insérées avec succès");
        }
    });
})
    
    
    // const {} = req.body;

    // db.query(query,[], (err) => {
    //     if (err) {
    //       return res.status(500).send(err);
    //     }else{
    //         res.status(200).send(`Données insérés avec succès`);
    //     }
        
    //   });
    
}) 

module.exports = router