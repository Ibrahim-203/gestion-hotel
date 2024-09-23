import React, { useEffect, useRef, useState } from 'react';
import SideBar from '../components/Sidebar';
import CustomModal from '../components/CustomModal';
import "rsuite/dist/rsuite.min.css"; 
import { 
    Form, 
    Schema, 
    InputNumber, 
    useToaster, 
    Message,
    Table,
    InputGroup, 
    Input,
    IconButton,
	DateRangePicker ,
	SelectPicker
} from 'rsuite';
import axios from 'axios';
import { Edit, Search, Trash } from '@rsuite/icons';
const Book = () => {

  const [open, setOpen] = useState(false);
  const [selectValue, setSelectValue] = useState('')
  const [selectRoomValue, setSelectRoomValue] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [nbrClient, setNbrClient] = useState(0)
  const [listClient, setListClient] = useState([])
  const [listChambre, setListChambre] = useState([])
  const [selectedDateRange, setSelectedDateRange] = useState([])
  const [formValue, setFormValue] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [listBook, setListBook] = useState([])
  const formRef = useRef()

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

      
// ------------------------ F O R  T A B L E ----------------------------//
    
    // Filtrer les données en fonction du texte de recherche
    const filteredData = listBook.filter(item => 
        item.clients.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
// ------------------------ F O R  T A B L E ----------------------------//

  // my function 
  const handleDateRangeChange = (range)=>{
    setSelectedDateRange(range)
  }
// Date Range Picker
const today = new Date();
today.setHours(0, 0, 0, 0);
  const disableBeforeMinDate = (date) => {
    return  date.setHours(0, 0, 0, 0) < today;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-CA');  // 'fr-CA' format gives 'YYYY-MM-DD'
    };
  const handleEdit = (data)=>{
    console.log(data);
    
  }
  const deleteBook = ()=>{

  }
  const handleOpen = () =>{
    setFormValue({})
    setSelectValue('')
    setOpen(true);
  } 
  const handleClose = () =>{
    setOpen(false);
  } 


  const getBook = async () =>{
    try{
        const response = await axios.get(`http://localhost:3001/book/`);
        setListBook(response.data)
    }catch(error){
        console.error('Erreur lors de la récupération des données:', error);
    }
    
  }
  useEffect(()=>{
    getBook()
  },[])

  const handleSubmit = ()=>{
    console.log("form submitted: ", formValue);
    if(!formRef.current.check()){
        console.error("Form error")
        return;
    }
     postBook(formValue)
     setFormValue({})
     handleClose()
  }

  const handleChange = (value) => {
    if(value>=1){
       setNbrClient(value)
    }
  }

// DATABASE REQUEST

  const getClient = async () => {
	try {
		const response = await axios.get(`http://localhost:3001/client/`);
		setListClient(response.data.map(item=>({label : `${item.nom} ${item.prenom}`, value : item.id})))		
	} catch (error) {
		console.error('Erreur lors de la récupération des données:', error);
	}
};
const postBook = async (data) => {
    try {
        if(isEditing){
        const response = await axios.put(`http://localhost:3001/book/${data.id}`, data);
        toaster.push(messageAdd, { placement, duration: 5000 });
        }else{
        const response = await axios.post('http://localhost:3001/book', data);
        toaster.push(messageAdd, { placement, duration: 5000 });
        }
        getBook(); 
        // Recharger les données après l'insertion
    } catch (error) {
        console.log(error);
        
        console.error('Erreur lors de l\'envoi des données:', error);
    }
};
// DATABASE REQUEST

  // my function 
  const getChambre = async (nbr,dateDebut, dateFin) => {
    if(nbr && dateDebut){

        const data = {dateDebut, dateFin}
        
	try {
		const response = await axios.get(`http://localhost:3001/room/reservation/${nbr}`,{
            params : data
        });
        const databaseData = response.data
        console.log(databaseData);
        
        setListChambre(databaseData.map(item=>({label : `Chambre ${item.num_room} `, value : item.id_room})));
        
	} catch (error) {
		console.error('Erreur lors de la récupération des données:', error);
	}
    }
    
};

useEffect(()=>{
	getClient()
    // getChambre(nbrClient)
}, [])

useEffect(()=>{
    if(selectedDateRange.length === 2){
        getChambre(nbrClient, selectedDateRange[0],selectedDateRange[1])
        setSelectRoomValue('')
    }
    
}, [nbrClient, selectedDateRange])


	// form rules
	const required =Schema.Types.NumberType().isRequired('Ce champ est obligatoire.')
	const requiredInt =Schema.Types.NumberType().isRequired('Ce champ est obligatoire.').min(1, 'La valeur doit être supérieure à 0.')

  function myContent(){
    return (
		<Form
        ref={formRef}
        onChange={setFormValue}
        formValue={formValue}
		model={Schema.Model({ 
            client: required, 
            nbr_client: requiredInt,
        })}
		>
			<div className="row formtype" style={{marginLeft: 0 ,marginRight: 0}}>
				<div className="col-md-3 mt-1">
				<Form.Group controlId="client">
                    <Form.ControlLabel>
                       Client
                    </Form.ControlLabel>
                    <SelectPicker
                        data={listClient}
                        searchable={false}
                        value = {selectValue}
                        placeholder="Choisir un client"
                        name="client"
                        onChange={(value) =>{
                            setSelectValue(value)
                            setFormValue({ ...formValue, client: value })
                        }} // Mettre à jour l'état du formulaire
                        />
                </Form.Group>
				</div>
				<div className="col-md-4 mt-1">
				<Form.Group controlId="nbr_client">
                    <Form.ControlLabel>
                        Nombres
                    </Form.ControlLabel>
                    <Form.Control name="nbr_client" accepter={InputNumber} onChange={handleChange}/>
                </Form.Group>
				</div>
				<div className="col-md-4 mt-1">
                    <Form.ControlLabel>
                        Date arrivée - départ
                    </Form.ControlLabel>
				<DateRangePicker 
                disabledDate={disableBeforeMinDate}
                onChange={(value)=>{
                    if(value){
                        handleDateRangeChange(value)
                        setFormValue({ ...formValue, date_arrive: value[0], date_depart: value[1] })
                    }
                    
                }}
                />
				</div>
				<div className="col-md-4 mt-1">
				<Form.Group controlId="libelle_prod">
                    <Form.ControlLabel>
                        Numero chambre
                    </Form.ControlLabel>
                    <SelectPicker
                        data={listChambre}
                        searchable={false}
                        value = {selectRoomValue}
                        placeholder="Choisir un chambre"
                        name="chambre"
                        onChange={(value) =>{
                            setSelectRoomValue(value)
                            setFormValue({ ...formValue, room: value })
                        }} // Mettre à jour l'état du formulaire
                        />
                </Form.Group>
				</div>
			</div>
		</Form>
    )
  }
    return (
        <div className="main-wrapper">
            {/* Sidebar */}
            <SideBar />
            {/* Modal */}
            <CustomModal title="Réservation" open={open} handleClose={handleClose} handleSubmit={handleSubmit} content ={myContent}/>
            <div className="page-wrapper">
                <div className="content container-fluid">
                    <div className="page-header">
                    <div className="row align-items-center">
						<div className="col">
							<div className="mt-5">
								<h4 className="card-title float-left mt-2">Réservations</h4> 
                                <button href="#" className="btn btn-primary float-right veiwbutton" onClick={handleOpen}>Réserver</button>
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
                                <Table.HeaderCell>client</Table.HeaderCell>
                                <Table.Cell dataKey='clients' />
                                    
                            </Table.Column>

                            <Table.Column width={300} align="center" >
                                <Table.HeaderCell>Chambre</Table.HeaderCell>
                                <Table.Cell dataKey='num_room'/>
                            </Table.Column>
                            <Table.Column width={300} align="center" >
                                <Table.HeaderCell>date arrivée</Table.HeaderCell>
                                <Table.Cell >
                                    {rowData=>formatDate(rowData.date_arrive)}
                                </Table.Cell>
                            </Table.Column>
                            <Table.Column width={300} align="center" >
                                <Table.HeaderCell>date sortie</Table.HeaderCell>
                                <Table.Cell >
                                    {rowData=>formatDate(rowData.date_depart)}
                                </Table.Cell>
                            </Table.Column>
                            <Table.Column width={200} align="center" fixed="right">
                                <Table.HeaderCell>Action</Table.HeaderCell>

                                <Table.Cell style={{ padding: '6px' }}>
                                {rowData => (
                                    <>
                                    <IconButton icon={<Edit color='green'/>} onClick={()=>{ handleEdit(rowData) }}/>
                                    <IconButton  icon={<Trash color='red'/>} onClick={()=>{deleteBook()}}/>
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

export default Book;