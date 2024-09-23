import React, { useEffect, useRef, useState } from 'react';
import SideBar from '../components/Sidebar';
import { IconButton, Table } from 'rsuite';
import axios from 'axios';
import { Edit, EyeClose } from '@rsuite/icons';
import ReactToPrint from 'react-to-print';

const ListStore = () => {
    const [listStore, setListStore] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [listPanier, setListPanier] = useState([])
    const [currentClient, setCurrentClient] = useState([])
    const [total, setTotal] = useState(0)
    const modalContentRef = useRef(); // Référence pour l'impression

    // filter table
    const filteredData = listStore.filter(item => 
        item.client.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const getInfoVente = async (id)=>{
        try {
            const response = await axios.get(`http://localhost:3001/store/prod/${id}`);
            setListPanier(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
        }
    }
    const viewStore = (id)=>{
        const client = listStore.filter(item=>item.id_vente_g == id)
        setCurrentClient(client)
        getInfoVente(id)
    }
    const getStore = async () => {
        try {
            const response = await axios.get('http://localhost:3001/store');
            setListStore(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
        }
    };
    useEffect(()=>{
        getStore()
    },[])

    // my functions 

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('fr-CA');  // 'fr-CA' format gives 'YYYY-MM-DD'
        };

    return (
        <div>
            <SideBar/>
            {/* Modal */}

            <div className="modal fade" id="staticBackdrop" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div className="modal-dialog modal-lg">
        <div className="modal-content">
        <div className="modal-header">
            <h5 className="modal-title" id="staticBackdropLabel">Valider la vente</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div className="modal-body" ref={modalContentRef}>
            <div className='text-center'>
                <h4>Facture de vente</h4>
            </div>
            <hr/>
            <h6>Information du client</h6>
            <div className="row mt-3 mb-3">
                {currentClient.map((item)=>(
                    <div className="col-sm-6">
                    <p>Nom et prénom : {item.client}</p>
                    <p>Date d'achat : {formatDate(item.date_vente)} </p>
                </div>
                ))}
                
            </div>
            <hr/>
            <table className="table table-striped">
                <tr className='table-secondary'>
                    <th>Produit</th>
                    <th>Quantite</th>
                    <th>Prix</th>
                </tr>
            {listPanier.map((item, index)=>(
                <tr key={index}>
                    <td>{item.libelle_prod}</td>
                    <td>{item.quantite_prod}</td>
                    <td>{item.prix_total} Ar</td>
                </tr>
            ))}
            <tr>
                <td colSpan={2}>Total</td>
                <td>{currentClient.length > 0 && currentClient[0].total_vente} Ar</td>
            </tr>
            </table>
            <div>
            <p>Date du {formatDate(new Date())}</p>
        </div>
        </div>
        
        <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-dismiss="modal">Annuler</button>
            <ReactToPrint
                trigger={() => <button type="button" className="btn btn-primary">Imprimer</button>}
                content={() => modalContentRef.current} // Impression du contenu du modal
            />
        </div>
        </div>
    </div>
    </div>

            <div className="page-wrapper">
			<div className="content container-fluid">
				<div className="page-header">
					<div className="row align-items-center">
						<div className="col">
							<div className="mt-5">
								<h4 className="blank_title float-left mt-2">Liste des ventes</h4>
                            </div>
						</div>
					</div>
				</div>
			</div>
            <div className="row">
					<div className="col-sm-12">
						<div className="card card-table">
							<div className="card-body booking_card">

                                
                        {/* Input de recherche */}
                        {/* <div className='row'>
                            <div className="col-sm-4">

                            <InputGroup inside>
                                <Input
                                placeholder="Rechercher un type de chambre"
                                value={searchTerm}
                                onChange={setSearchTerm}
                                />
                                <InputGroup.Addon>
                                <Search/>
                                </InputGroup.Addon>
                            </InputGroup>
                            </div>
                        </div>
                        <hr /> */}
                        

                        {/* Table to display the data */}

                        <Table height={400} data={filteredData}>
                            <Table.Column width={200} align="center">
                                <Table.HeaderCell>Client</Table.HeaderCell>
                                <Table.Cell dataKey='client' />
                                    
                            </Table.Column>

                            <Table.Column width={300} align="center" >
                                <Table.HeaderCell>Total Achat</Table.HeaderCell>
                                <Table.Cell>
                                {rowData=>`${rowData.total_vente} Ar`}
                                </Table.Cell>
                            </Table.Column>
                            <Table.Column width={200} align="center" fixed="right">
                                <Table.HeaderCell>Action</Table.HeaderCell>

                                <Table.Cell style={{ padding: '6px' }}>
                                {rowData => (
                                    <>
                                    <IconButton icon={<EyeClose color='blue'/>} data-toggle="modal" data-target="#staticBackdrop" onClick={()=>{viewStore(rowData.id_vente_g)}}/>
                                    </>
                                )}
                                </Table.Cell>
                            </Table.Column>
                        </Table>

                            </div>
                            </div>
                            </div>
                            </div>
		</div>
        </div>
    );
};

export default ListStore;