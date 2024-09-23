import React, { useEffect, useState } from 'react';
import SideBar from '../components/Sidebar';
import axios from 'axios';
import { Input, InputGroup,  Message,  useToaster } from 'rsuite';
import { Search } from '@rsuite/icons';

const Store = () => {

    const [listProduct, setListProduct] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [listPanier, setListPanier] = useState([])
    const [statusBtnValid, setStatusBtnValid] = useState(true)
    const [total, setTotal] = useState(0)
    const [listClient, setListClient] = useState([])
    const [infoVente, setInfoVente] = useState([])
    const [infoClient, setInfoClient] = useState([])

      // ------------------------ F O R  N O T I F I C A T I O N ----------------------------//
      const toaster = useToaster();
      const type = 'success';
      const placement = 'topEnd';
  
      const messageAdd = (
          <Message showIcon type={type} closable>
              <strong>Success!</strong> Données insérées avec succès.
          </Message>
      );
      const messageDelete = (
          <Message showIcon type={type} closable>
              <strong>Success!</strong> Données Supprimer avec succès.
          </Message>
      );
      // ------------------------ F O R  N O T I F I C A T I O N ----------------------------//
        

    // Contenu du modal

        // My functions 
        const postStore = async (data) => {
            try {
                const response = await axios.post(`http://localhost:3001/store`, data);
                toaster.push(messageAdd, { placement, duration: 5000 });
                setListPanier([])
                setInfoVente([])
                // Recharger les données après l'insertion
            } catch (error) {
                console.log(error);
                console.error('Erreur lors de l\'envoi des données:', error);
            }
        };

        const handleChange = (e) => {
            console.log(listClient);
            
            const selectedIndex = e.target.value; // Récupère l'index du client sélectionné
            
            const selectedClient = listClient.filter(item=>item.id_client == selectedIndex); // Récupère l'objet client correspondant
            setInfoClient(selectedClient); // Met à jour l'état avec toutes les données du client
          };
        const saveData = ()=>{
            const dataToSend = { infoClient, listPanier, total };
            postStore(dataToSend)

        }

        const getProduct = async () => {
            try {
                const response = await axios.get('http://localhost:3001/product');
                setListProduct(response.data);
    
                
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
            }
        };
        const getClient = async () => {
            try {
                const response = await axios.get('http://localhost:3001/store/client');
                setListClient(response.data);
    
                
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
            }
        };
        useEffect(()=>{
            console.log(infoVente);
            
        },[infoVente])

        const handleAdd = (data)=>{
            const{id_prod, libelle_prod, prix_unit} = data
            const produitExistant = listPanier.find(item => item.id_prod === data.id_prod);

            if (produitExistant) {
                // Si le produit existe, on augmente la quantité et on met à jour le total
                setListPanier(listPanier.map(item =>
                  item.id_prod === data.id_prod
                    ? { ...item, quantite: item.quantite + 1, total: (item.quantite + 1) * item.prix_unit }
                    : item
                ));
              }else{
                setListPanier([...listPanier, {id_prod,libelle_prod,prix_unit, quantite: 1, total : data.prix_unit} ])
              }
            
            
        }

        const editQuantit = (id_prod, status)=>{
            if(status === "add"){
            setListPanier(listPanier.map(item => id_prod === item.id_prod ? { ...item, quantite: item.quantite + 1, total: (item.quantite + 1) * item.prix_unit } : item))
            }else{
            setListPanier(listPanier.map(item => id_prod === item.id_prod ? (item.quantite > 1 ? { ...item, quantite: item.quantite - 1, total: (item.quantite - 1) * item.prix_unit }: item) : item))
            }
        }
        const handleRemove = (id_prod)=>{
            const newData = listPanier.filter((item)=> item.id_prod !== id_prod)
            setListPanier(newData)
        }
        
    
        useEffect(()=>{
            getProduct()
            getClient()
        },[])

        useEffect(()=>{
            const sommeTotale = listPanier.reduce((acc, item) => acc + item.total, 0);
           setTotal(sommeTotale);
           setStatusBtnValid( listPanier.length > 0 ? false : true)
            
        },[listPanier])
        useEffect(()=>{
            console.log(infoClient);
        },[infoClient])
        
        const filteredData = listProduct.filter(item => 
            item.libelle_prod.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
   return(<div>
        <div className="main-wrapper">
            {/* Sidebar */}
            <SideBar />

            

            {/* Modal */}
<div class="modal fade" id="staticBackdrop" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="staticBackdropLabel">Valider la vente</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <h6>Information du client</h6>
        <div className="row mt-3 mb-3">
            <div className="col-sm-4">
                <select className='form-control' onChange={(e) => handleChange(e)} name="" id="">
                    <option value="" disabled selected>Selectionner un client</option>
                    {listClient.map((client, index)=>(
                        <option key={index} value={client.id_client}>{client.client}</option>
                    ))}
                </select>
            </div>
        </div>
        <table className="table table-striped">
            <tr className='table-secondary'>
                <th>Produit</th>
                <th>Quantite</th>
                <th>Prix</th>
            </tr>
        {listPanier.map(item=>(
            <tr>
                <td>{item.libelle_prod}</td>
                <td>{item.quantite}</td>
                <td>{item.total} Ar</td>
            </tr>
        ))}
        <tr>
            <td colSpan={2}>Total</td>
            <td>{total} Ar</td>
        </tr>
        </table>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Annuler</button>
        <button type="button" class="btn btn-primary" onClick={saveData} data-dismiss="modal">Valider</button>
      </div>
    </div>
  </div>
</div>
            
            {/* Modal */}
            <div className="page-wrapper">
                <div className="content container-fluid">
                    <div className="page-header">
                        <h1 className="mt-5 blank_title">Espace vente</h1> </div>
                        <div className="row">
                            <div className="col-md-8">
                                    <div className="card">
                                        <div className="card-header">
                                        <InputGroup inside>
                                            <Input
                                            placeholder="Rechercher un produit"
                                            value={searchTerm}
                                            onChange={setSearchTerm}
                                            />
                                            <InputGroup.Addon>
                                            <Search/>
                                            </InputGroup.Addon>
                                        </InputGroup>
                                        </div>
                                            <div className="card-body" style={{maxHeight : 300}}>
                                                <div className="d-flex flex-wrap px-auto">
                                                    {filteredData.map((data)=>(
                                                        <div className='mr-4 mb-2' style={{cursor:'pointer'}} key={data.id_prod} onClick={()=>handleAdd(data)}>
                                                        <img src={`http://localhost:3001/getImages/${data.image}`} width={120} height={100} style={{borderRadius:"9px 9px 0px 0px"}}/>
                                                        <p className='text-center font-weight-bold bg-secondary text-light' style={{borderRadius:"0px 0px 9px 9px"}}>{data.libelle_prod}</p>
                                                    </div>
                                                    )
                                                    )}
                                               </div>
                                            </div>
                                        </div>
                            </div>
                            <div className="col-md-4">
                            <div className="card">
                                <div className="card-header">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h4 className="card-title">Panier {listPanier.length>0 && <span className="badge badge-info">{listPanier.length}</span>} </h4>
                                        </div>
                                        <div className="col-md-6 text-right">
                                            <a className={`btn btn-primary btn-sm ${statusBtnValid ? 'disabled' : ''}`} role="button" aria-disabled={statusBtnValid} data-toggle="modal" data-target="#staticBackdrop"><i className="fas fa-shopping-cart"></i></a>
                                        </div>
                                    </div>
                                
                                </div>
                                <div className="card-body" style={{maxHeight : 300, overflow : 'auto'}}>
                                <blockquote className="blockquote mb-0">
                                <p className="mb-0">
                                <table className="table table-striped m-0">
                                <tbody>
                                    {listPanier.map((item)=>(
                                        <tr>
                                    <td><button className='btn btn-danger rounded-pill btn-sm' onClick={()=>handleRemove(item.id_prod)}>x</button></td>
                                    <td>{item.libelle_prod}</td>
                                    <td><div className="btn-group" role="group" aria-label="Second group">
                                            <button type="button" className="btn btn-secondary btn-sm" onClick={()=>editQuantit(item.id_prod,"remove")}>-</button>
                                            <p className='p-1'>{item.quantite}</p>
                                            <button type="button" className="btn btn-secondary btn-sm" onClick={()=>editQuantit(item.id_prod,"add")}>+</button>
                                        </div>
                                    </td>
                                    <td>{item.total}</td>
                                    </tr>
                                    ))}
                                    
                                </tbody>
                                </table>
                                </p>
                                </blockquote>
                                </div>
                                <div className="card-footer">
                                    <div className="row">
                                        <div className="col-md-6">
                                        <h5>Total</h5>
                                        </div>
                                        <div className="col-md-6 text-right">
                                           <h6>{total} ar</h6>
                                        </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                        
                        </div>
                </div>
            </div>
        </div>
    </div>)
};

export default Store;