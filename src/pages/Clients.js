import React, { useState, useRef, useEffect }  from 'react';
import SideBar from '../components/Sidebar';
import CustomModal from '../components/CustomModal';
import { 
    Form, 
    DatePicker, 
    Grid, 
    Row, 
    Col, 
    Schema, 
    SelectPicker, 
    InputNumber, 
    useToaster, 
    Message,
    Table,
    InputGroup, 
    Input,
    IconButton
} from 'rsuite';
import axios from 'axios';
import { Edit, Search, Trash } from '@rsuite/icons';

const Clients = () => {

    
	const [open, setOpen] = useState(false);

	const handleClose = () => setOpen(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectValue, setSelectValue] = useState('')
    const [listClient, setListClient] = useState([])
    const [searchTerm, setSearchTerm] = useState('')

    const handleOpen = () => {
        setIsEditing(false)
        setSelectValue('')
        setFormValue({});
        setOpen(true);
    };

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

// ------------------------ D A T A B A S E  R E Q U E S T ----------------------------//
        const postClient = async (data) => {
            try {
                if(isEditing){
                const response = await axios.put(`http://localhost:3001/client/${data.id}`, data);
                toaster.push(messageAdd, { placement, duration: 5000 });
                }else{
                const response = await axios.post('http://localhost:3001/client', data);
                toaster.push(messageAdd, { placement, duration: 5000 });
                }
                getClients(); // Recharger les données après l'insertion
            } catch (error) {
                console.error('Erreur lors de l\'envoi des données:', error);
            }
        };
    
        const getClients = async () => {
            try {
                const response = await axios.get('http://localhost:3001/client');
                setListClient(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
            }
        };
        
        const deleteClient = async (id) => {
            try {
                const response = await axios.delete(`http://localhost:3001/client/${id}`);
                toaster.push(messageDelete, { placement, duration: 5000 });
                getClients()
                console.log(response.data);
            } catch (error) {
                console.error('Erreur de Suppression:', error);
            }
        };
        useEffect(() => {
            getClients()
        }, []);
// ------------------------ D A T A B A S E  R E Q U E S T ----------------------------//

    // ------------------------ F O R  T A B L E ----------------------------//
    
    // Filtrer les données en fonction du texte de recherche
const filteredData = listClient.filter(item => 
    item.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.prenom.toLowerCase().includes(searchTerm.toLowerCase())
);


    // ------------------------ F O R  T A B L E ----------------------------//

    // data of select
    const data = ['Carte d\'identité', 'Passeport', 'Permis de conduire'].map(
        item => ({ label: item, value: item })
      );

    const [formValue, setFormValue] = useState({})
    const formRef = useRef()

    // Form rules
    const required =Schema.Types.StringType().isRequired("Champ obligatoire");
    const requiredDate =Schema.Types.DateType().isRequired("Champ obligatoire");
    // My function
    const handleSubmit = ()=>{
        if(!formRef.current.check()){
            console.error("Form error")
            return;
        }
        console.log("form submitted: ", formValue);
        postClient(formValue)
        setFormValue({})
        handleClose()
        
    }

    const handleEdit = (data) => {
        console.log(data);
        setSelectValue(data.piece_idtt)
        setFormValue({
            id : data.id,
            name : data.nom,
            surname : data.prenom,
            date_naiss : new Date(data.date_naiss),
            lieu_naiss : data.lieu_naiss,
            pere : data.pere,
            mere : data.mere,
            profession : data.proffession ,
            domicile : data.domicile ,
            nationalite : data.nationalite,
            date_dlvr : new Date(data.date_dlvr),
            lieu_dlvr : data.lieu_dlvr,
            num_idtt : data.num_idtt,
        });
        
        setIsEditing(true);
        setOpen(true);
    };

    function myContent() {
        return <Form
        ref={formRef}
        onChange={setFormValue}
        formValue={formValue}
        model={Schema.Model({ 
            name: required, 
            lieu_naiss: required, 
            profession: required, 
            domicile: required, 
            piece_idtt: required,
            date_naiss : requiredDate,
            date_dlvr : requiredDate,
            num_idtt: required, 
            lieu_dlvr: required
        })}
        >
            <Grid fluid>
                <Row gutter={8}>
                    <Col>
                    <Form.Group controlId="name">
                    <Form.ControlLabel>
                        Nom client
                    </Form.ControlLabel>
                    <Form.Control name="name"/>
                </Form.Group>
                    </Col>
                    <Col>
                    <Form.Group controlId="surname">
                    <Form.ControlLabel>
                        Prénom client
                    </Form.ControlLabel>
                    <Form.Control name="surname"/>
                </Form.Group>
                    </Col>
                    <Col>
                    <Form.Group controlId="date_naiss">
                    <Form.ControlLabel>
                        Date de naissance
                    </Form.ControlLabel>
                    <Form.Control name="date_naiss" accepter={DatePicker}/>
                </Form.Group>
                    </Col>
                </Row>
                <Row gutter={8} className='mt-3'>
                    <Col>
                    <Form.Group controlId="lieu_naiss">
                    <Form.ControlLabel>
                        Lieu de naissance
                    </Form.ControlLabel>
                    <Form.Control name="lieu_naiss"/>
                </Form.Group>
                    </Col>
                    <Col>
                    <Form.Group controlId="pere">
                    <Form.ControlLabel>
                        Père
                    </Form.ControlLabel>
                    <Form.Control name="pere"/>
                </Form.Group>
                    </Col>
                    <Col>
                    <Form.Group controlId="mere">
                    <Form.ControlLabel>
                        Mère
                    </Form.ControlLabel>
                    <Form.Control name="mere" />
                </Form.Group>
                    </Col>
                </Row>
                <Row gutter={8} className='mt-3'>
                    <Col>
                    <Form.Group controlId="profession">
                    <Form.ControlLabel>
                        Proffesion
                    </Form.ControlLabel>
                    <Form.Control name="profession"/>
                </Form.Group>
                    </Col>
                    <Col>
                    <Form.Group controlId="domicile">
                    <Form.ControlLabel>
                        Domicile habituel
                    </Form.ControlLabel>
                    <Form.Control name="domicile"/>
                </Form.Group>
                    </Col>
                    <Col>
                    <Form.Group controlId="nationalite">
                    <Form.ControlLabel>
                        Nationalité
                    </Form.ControlLabel>
                    <Form.Control name="nationalite" />
                </Form.Group>
                    </Col>
                </Row>
                <p className='mt-3'>Information pièce d'identité</p>
                <Row gutter={8} className='mt-3'>
                    <Col>
                    <Form.Group controlId="piece_idtt">
                    <Form.ControlLabel>
                        Pièce d'identité
                    </Form.ControlLabel>
                    <SelectPicker
                        data={data}
                        searchable={false}
                        value = {selectValue}
                        placeholder="Choisir une pice"
                        name="piece_idtt"
                        onChange={(value) =>{
                            setSelectValue(value)
                            setFormValue({ ...formValue, piece_idtt: value })
                        }} // Mettre à jour l'état du formulaire
                        />
                </Form.Group>
                    </Col>
                    <Col>
                    <Form.Group controlId="num_idtt">
                    <Form.ControlLabel>
                        Numéro
                    </Form.ControlLabel>
                    <Form.Control name="num_idtt" accepter={InputNumber}/>
                </Form.Group>
                    </Col>
                    <Col>
                    <Form.Group controlId="date_dlvr">
                    <Form.ControlLabel>
                        Date de delivrance
                    </Form.ControlLabel>
                    <Form.Control name="date_dlvr" accepter={DatePicker}/>
                </Form.Group>
                    </Col>
                </Row>
                <Row gutter={8} className='mt-3'>
                    <Col>
                    <Form.Group controlId="lieu_dlvr">
                    <Form.ControlLabel>
                        Lieu de delivrance
                    </Form.ControlLabel>
                    <Form.Control name="lieu_dlvr"/>
                </Form.Group>
                    </Col>
                </Row>
                
            </Grid>
    </Form>
    }


    return (
        <div className="main-wrapper">
            {/* Sidebar */}
            <SideBar />
            <CustomModal title="Ajouter un client" open={open} handleClose={handleClose} content={myContent} handleSubmit={handleSubmit}/>
            <div className="page-wrapper">
                <div className="content container-fluid">
                    <div className="page-header">
                    <div className="row align-items-center">
						<div className="col">
							<div className="mt-5">
								<h4 className="blank_title float-left mt-2">Clients</h4> <a href="#" className="btn btn-primary float-right veiwbutton" onClick={handleOpen}>Ajouter un client</a> </div>
						</div>
					</div>
                    </div>
                    <div className="row">
					<div className="col-sm-12">
						<div className="card card-table">
							<div className="card-body booking_card">

                                
                        {/* Input de recherche */}
                        <div className='row'>
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
                        <hr />
                        

                        {/* Table to display the data */}

                        <Table height={400} data={filteredData}>
                            <Table.Column width={200} align="center">
                                <Table.HeaderCell>Nom et prénom</Table.HeaderCell>
                                <Table.Cell>
                                    {rowData => `${rowData.nom} ${rowData.prenom}`}
                                </Table.Cell>
                            </Table.Column>

                            <Table.Column width={300} align="center" >
                                <Table.HeaderCell>Proffession</Table.HeaderCell>
                                <Table.Cell dataKey='proffession' />
                            </Table.Column>
                            <Table.Column width={300} align="center" >
                                <Table.HeaderCell>Nationalité</Table.HeaderCell>
                                <Table.Cell dataKey='nationalite' />
                            </Table.Column>
                            <Table.Column width={300} align="center">
                                <Table.HeaderCell>Numéro CNI</Table.HeaderCell>
                                <Table.Cell dataKey='num_idtt' />
                            </Table.Column>
                            <Table.Column width={200} align="center" fixed="right">
                                <Table.HeaderCell>Action</Table.HeaderCell>

                                <Table.Cell style={{ padding: '6px' }}>
                                {rowData => (
                                    <>
                                    <IconButton icon={<Edit color='green'/>} onClick={()=>{
                                        handleEdit(rowData)
                                    }}/>
                                    <IconButton  icon={<Trash color='red'/>} onClick={()=>{
                                        deleteClient(rowData.id)
                                    }}/>
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
        </div>
    );
};

export default Clients;