import React, { useEffect, useRef, useState } from 'react';
import SideBar from '../components/Sidebar';
import CustomModal from '../components/CustomModal';
import { Form, Schema, FlexboxGrid, InputNumber, Message, useToaster, Table, InputGroup, Input, IconButton } from 'rsuite';
import { Edit, Trash, Search } from '@rsuite/icons';
import axios from 'axios';

const RoomType = () => {
    const [open, setOpen] = useState(false);
    const [formValue, setFormValue] = useState({});
    const [listType, setListType] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const formRef = useRef();

    const toaster = useToaster();
    const type = 'success';
    const placement = 'topEnd';

    const messageAdd = (
        <Message showIcon type={type} closable>
            <strong>Success!</strong> Données insérées avec succès.
        </Message>
    );

    const messageEdit = (
        <Message showIcon type={type} closable>
            <strong>Success!</strong> Données modifiées avec succès.
        </Message>
    );

    const messageDelete = (
        <Message showIcon type={type} closable>
            <strong>Success!</strong> Données supprimées avec succès.
        </Message>
    );

    const postType = async (data) => {
        try {
            if (isEditing) {
                await axios.put(`http://localhost:3001/typeRoom/${data.id_type_room}`, data);
                toaster.push(messageEdit, { placement, duration: 5000 });
            } else {
                await axios.post('http://localhost:3001/typeRoom', data);
                toaster.push(messageAdd, { placement, duration: 5000 });
            }
            getTypeRoom();
        } catch (error) {
            console.error('Erreur lors de l\'envoi des données:', error);
        }
    };

    const updateTypeRoom = async (id, data) => {
        try {
            const response = await axios.put(`http://localhost:3001/typeRoom/${id}`, data);
            toaster.push(messageAdd, { placement, duration: 5000 });
            console.log('Données mises à jour:', response.data);
            getTypeRoom(); // Recharger les données après la mise à jour
        } catch (error) {
            console.error('Erreur lors de la mise à jour des données:', error);
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

    const handleOpen = () => {
        setFormValue({});
        setIsEditing(false);
        setOpen(true);
    };

    const handleEdit = (typeRoom) => {
        setFormValue({
            type: typeRoom.type,
            price: typeRoom.price,
            nbr_bed : typeRoom.nbr_bed,
            id_type_room: typeRoom.id_type_room, // Ajouter l'ID pour pouvoir l'utiliser lors de la mise à jour
        });
        setIsEditing(true);
        setOpen(true);
    };

    const handleSubmit = () => {
        if (!formRef.current.check()) {
            console.error("Form error");
            return;
        }

        postType(formValue);
        
        setFormValue({});
        formRef.current.cleanErrors();
        setOpen(false);
    };

    const deleteTypeRoom = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/typeRoom/${id}`);
            toaster.push(messageDelete, { placement, duration: 5000 });
            getTypeRoom();
        } catch (error) {
            console.error('Erreur de suppression:', error);
        }
    };

    useEffect(() => {
        getTypeRoom();
    }, []);

    const filteredData = listType.filter(item =>
        item.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const typeRule = Schema.Types.StringType().isRequired("La libellé est obligatoire");
    const numericRule = Schema.Types.NumberType().isRequired("Prix obligatoire");

    function myContent() { 
        return (
            <Form
                ref={formRef}
                onChange={setFormValue}
                formValue={formValue}
                model={Schema.Model({ type: typeRule, price: numericRule, nbr_bed : numericRule })}
            >
                <div className="row" style={{marginLeft: 0 ,marginRight: 0}}>
                <div class="col-md-4 mt-1">
				<Form.Group controlId="type">
                    <Form.ControlLabel>Type de chambre</Form.ControlLabel>
                    <Form.Control name="type" />
                </Form.Group>
				</div>
                <div class="col-md-4 mt-1">
				<Form.Group controlId="price">
                    <Form.ControlLabel>Prix nuité (Ar)</Form.ControlLabel>
                    <Form.Control name="price" accepter={InputNumber} />
                </Form.Group>
				</div>
                <div class="col-md-4 mt-1">
				<Form.Group controlId="nbr_bed">
                    <Form.ControlLabel>Nombre de chambre</Form.ControlLabel>
                    <Form.Control name="nbr_bed" accepter={InputNumber} />
                </Form.Group>
				</div>
                </div>
            </Form>
        );
    }

    return (
        <div>
            <div className="main-wrapper">
                <SideBar />
                <CustomModal title={isEditing ? "Modifier le type de chambre" : "Ajouter une type de chambre"} open={open} handleClose={() => setOpen(false)} content={myContent} handleSubmit={handleSubmit} />
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

                                        <div className='row'>
                                            <div className="col-sm-4">
                                                <InputGroup inside>
                                                    <Input
                                                        placeholder="Rechercher un type de chambre"
                                                        value={searchTerm}
                                                        onChange={setSearchTerm}
                                                    />
                                                    <InputGroup.Addon>
                                                        <Search />
                                                    </InputGroup.Addon>
                                                </InputGroup>
                                            </div>
                                        </div>
                                        <hr />

                                        <Table height={400} data={filteredData}>
                                            <Table.Column width={300}>
                                                <Table.HeaderCell>Type</Table.HeaderCell>
                                                <Table.Cell dataKey="type" />
                                            </Table.Column>
                                            <Table.Column width={100} align="center">
                                                <Table.HeaderCell>Nombre de lit</Table.HeaderCell>
                                                <Table.Cell dataKey='nbr_bed'/>
                                            </Table.Column>
                                            <Table.Column width={300} align="center">
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
                                                            <IconButton icon={<Edit color='green' />} onClick={() => handleEdit(rowData)} />
                                                            <IconButton icon={<Trash color='red' />} onClick={() => deleteTypeRoom(rowData.id_type_room)} />
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
