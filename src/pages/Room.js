import React, { useState, useRef, useEffect } from 'react';
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


const Room = () => {

    const [selectValue, setSelectValue] = useState('')
	const [formValue,setFormValue] = useState({})
    const [searchTerm, setSearchTerm] = useState('')
	const [isEditing, setIsEditing] = useState(false);
    const [listTypeRoom, setListTypeRoom] = useState({})
    const [listRoom, setListRoom] = useState([])
	const formRef = useRef()
	const [open, setOpen] = useState(false);

	const handleOpen = () => {
        setFormValue({})
        setSelectValue('')
        
        setOpen(true)
    };
	const handleClose = () => setOpen(false);

	// form rules
	const required =Schema.Types.NumberType().isRequired('Ce champ est obligatoire.').min(1, 'La valeur doit être supérieure à 0.')

    // My functions

    

    const handleSubmit = ()=>{
        console.log("form submitted: ", formValue);
        if(!formRef.current.check()){
            console.error("Form error")
            return;
        }
        
        postRoom(formValue)
        setFormValue({})
        handleClose()
    }

    const handleEdit = (data) => {
        setIsEditing(true);
        console.log(data);
        setSelectValue(data.id_type_room)
        setFormValue({
            id : data.id_room,
            num_room : data.num_room,
            type_room : data.id_type_room,
        });
        
        setOpen(true);
    };

    const deleteRoom = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:3001/room/${id}`);
            toaster.push(messageDelete, { placement, duration: 5000 });
            getRoom()
        } catch (error) {
            console.error('Erreur de Suppression:', error);
        }
    };

    // End my functions


    
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
    const postRoom = async (data) => {
        try {
            if(isEditing){
            const response = await axios.put(`http://localhost:3001/room/${data.id}`, data);
            toaster.push(messageAdd, { placement, duration: 5000 });
            }else{
            const response = await axios.post('http://localhost:3001/room', data);
            toaster.push(messageAdd, { placement, duration: 5000 });
            }
            getRoom(); // Recharger les données après l'insertion
        } catch (error) {
            console.log(error);
            
            console.error('Erreur lors de l\'envoi des données:', error);
        }
    };

    const getRoom = async () => {
        try {
            const response = await axios.get('http://localhost:3001/room');
            setListRoom(response.data);

            
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
        }
    };
    

    const getTypeRoom = async () => {
        try {
            const response = await axios.get('http://localhost:3001/typeRoom');
            setListTypeRoom(response.data.map(item=>({label : item.type, value : item.id_type_room})))
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
        }
    }

    useEffect(()=>{
        getTypeRoom()
        getRoom()
    },[])
// ------------------------ D A T A B A S E  R E Q U E S T ----------------------------//


// ------------------------ F O R  T A B L E ----------------------------//
    
    // Filtrer les données en fonction du texte de recherche
    const filteredData = listRoom.filter(item => 
        item.num_room.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
// ------------------------ F O R  T A B L E ----------------------------//

	function myContent(){
		return <Form
        ref={formRef}
        onChange={setFormValue}
        formValue={formValue}
        model={Schema.Model({ 
            num_room: required, 
            type_room: required, 
        })}
        >
            <Grid fluid>
                <Row gutter={8}>
                    <Col>
                    <Form.Group controlId="num_room">
                    <Form.ControlLabel>
                        Numéro de chambre
                    </Form.ControlLabel>
                    <Form.Control name="num_room" accepter={InputNumber}/>
                </Form.Group>
                    </Col>
                    <Col>
                    <Form.Group controlId="type_room">
                    <Form.ControlLabel>
                        Type de chambre
                    </Form.ControlLabel>
                    <SelectPicker
                        data={listTypeRoom}
                        searchable={false}
                        value = {selectValue}
                        placeholder="Choisir un type"
                        name="type_room"
                        onChange={(value) =>{
                            setSelectValue(value)
                            setFormValue({ ...formValue, type_room: value })
                        }} // Mettre à jour l'état du formulaire
                        />
                </Form.Group>
                    </Col>
                    <Col>
                    </Col>
                </Row>
                
            </Grid>
    </Form>
	}
	
    return (
        <div>
        <div className="main-wrapper">
        {/* SideBar */}
		<SideBar /> 
		{/* SideBar */}
		{/* Modal */}
		<CustomModal title="Ajouter une chambre" open={open} handleClose={handleClose} handleSubmit={handleSubmit} content = {myContent}/>
            <div className="page-wrapper">
			<div className="content container-fluid">
				<div className="page-header">
					<div className="row align-items-center">
						<div className="col">
							<div className="mt-5">
								<h4 className="blank_title float-left mt-2">Les chambres</h4> <a href="#" className="btn btn-primary float-right veiwbutton" onClick={handleOpen}>Ajouter une chambre</a> </div>
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
                            <Table.Column width={200} align="center">
                                <Table.HeaderCell>Numéro chambre</Table.HeaderCell>
                                <Table.Cell dataKey='num_room' />
                                    
                            </Table.Column>

                            <Table.Column width={300} align="center" >
                                <Table.HeaderCell>Type chambre</Table.HeaderCell>
                                <Table.Cell dataKey='type'/>
                            </Table.Column>
                            <Table.Column width={300} align="center" >
                                <Table.HeaderCell>nombre de lit</Table.HeaderCell>
                                <Table.Cell dataKey='nbr_bed' />
                            </Table.Column>
                            <Table.Column width={200} align="center" fixed="right">
                                <Table.HeaderCell>Action</Table.HeaderCell>

                                <Table.Cell style={{ padding: '6px' }}>
                                {rowData => (
                                    <>
                                    <IconButton icon={<Edit color='green'/>} onClick={()=>{ handleEdit(rowData) }}/>
                                    <IconButton  icon={<Trash color='red'/>} onClick={()=>{deleteRoom(rowData.id_room)}}/>
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

export default Room;