import React, { useEffect, useRef, useState } from 'react';
import SideBar from '../components/Sidebar';
import CustomModal from '../components/CustomModal';
import { Form, Schema, FlexboxGrid, InputNumber, Message, useToaster, Table, InputGroup,Input, IconButton } from 'rsuite';
import { Edit , Trash, Search} from '@rsuite/icons';
import axios from 'axios';

const RoomType = () => {

    // Déclaration de variable
    const [open, setOpen] = useState(false);
    const [formValue, setFormValue] = useState({});
    const [listType, setListType] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // État pour la recherche
    const formRef = useRef();
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
    const postType = async (data) => {
        try {
            const response = await axios.post('http://localhost:3001/typeRoom', data);
            toaster.push(messageAdd, { placement, duration: 5000 });
            console.log('Réponse du serveur:', response.data);
            getTypeRoom(); // Recharger les données après l'insertion
        } catch (error) {
            console.error('Erreur lors de l\'envoi des données:', error);
        }
    };

    const getTypeRoom = async () => {
        try {
            const response = await axios.get('http://localhost:3001/typeRoom');
            setListType(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
        }
    };
    const getSingleTypeRoom = async (id) => {
        try {
            const response = await axios.get(`http://localhost:3001/typeRoom/${id}`);
            console.log(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
        }
    };

    const deleteTypeRoom = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:3001/typeRoom/${id}`);
            toaster.push(messageDelete, { placement, duration: 5000 });
            getTypeRoom()
            console.log(response.data);
        } catch (error) {
            console.error('Erreur de Suppression:', error);
        }
    };
    // ------------------------ D A T A B A S E  R E Q U E S T ----------------------------//
    useEffect(() => {
        getTypeRoom();
    }, []);

    // ------------------------ M Y  R E Q U E S T S ----------------------------//
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSubmit = () => {
        if (!formRef.current.check()) {
            console.error("Form error");
            return;
        }
        postType(formValue);
        setFormValue({});
        formRef.current.cleanErrors();
        handleClose();
    };

    // ------------------------ M Y  R E Q U E S T S ----------------------------//


    // ------------------------ F O R  T A B L E ----------------------------//
    
    // Filtrer les données en fonction du texte de recherche
    const filteredData = listType.filter(item => 
        item.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // ------------------------ F O R  T A B L E ----------------------------//

    // ------------------------ F O R  M O D A L ----------------------------//

    // Règle de validation des données du modal
    const typeRule = Schema.Types.StringType().isRequired("La libellé est obligatoire");
    const priceRule = Schema.Types.StringType().isRequired("Prix obligatoire");

    function myContent() {
        return (
            <Form
                ref={formRef}
                onChange={setFormValue}
                formValue={formValue}
                model={Schema.Model({ type: typeRule, price: priceRule })}
            >
                <FlexboxGrid justify="space-around">
                    <FlexboxGrid.Item colspan={7}>
                        <Form.Group controlId="type">
                            <Form.ControlLabel>Type de chambre</Form.ControlLabel>
                            <Form.Control name="type" />
                        </Form.Group>
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item colspan={7}>
                        <Form.Group controlId="price">
                            <Form.ControlLabel>Prix nuité (Ar)</Form.ControlLabel>
                            <Form.Control name="price" accepter={InputNumber} />
                        </Form.Group>
                    </FlexboxGrid.Item>
                </FlexboxGrid>
            </Form>
        );
    }
    // ------------------------ F O R  M O D A L ----------------------------//

    return (
        <div>
            <div className="main-wrapper">
                <SideBar />
                <CustomModal title="Ajouter une type de chambre" open={open} handleClose={handleClose} content={myContent} handleSubmit={handleSubmit} />
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <div className="page-header">
                            <div className="row align-items-center">
                                <div className="col">
                                    <div className="mt-5">
                                        <h4 className="blank_title float-left mt-2">Types de chambre</h4>
                                        <a href="#" className="btn btn-primary float-right veiwbutton" onClick={handleOpen}>Nouveau</a>
                                    </div>
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
                            <Table.Column align="center" fixed>
                                <Table.HeaderCell>Type</Table.HeaderCell>
                                <Table.Cell dataKey="type" />
                            </Table.Column>

                            <Table.Column width={300} align="center" fixed>
                                <Table.HeaderCell>Prix</Table.HeaderCell>
                                <Table.Cell>
                                {rowData => `${rowData.price} Ar`}
                                </Table.Cell>
                            </Table.Column>
                            <Table.Column width={200} fixed="right">
                                <Table.HeaderCell>Action</Table.HeaderCell>

                                <Table.Cell style={{ padding: '6px' }}>
                                {rowData => (
                                    <>
                                    <IconButton icon={<Edit color='green'/>} onClick={()=>{
                                        getSingleTypeRoom(rowData.id_type_room)
                                    }}/>
                                    <IconButton  icon={<Trash color='red'/>} onClick={()=>{
                                        deleteTypeRoom(rowData.id_type_room)
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
        </div>
    );
};

export default RoomType;
