import React, { useState, useRef, useEffect } from 'react';
import SideBar from '../components/Sidebar';

import CustomModal from '../components/CustomModal';
import { 
    Form, 
    Grid, 
    Row, 
    Col, 
    Schema, 
    InputNumber, 
    useToaster, 
    Message,
    Table,
    InputGroup, 
    Input,
    IconButton,
    Uploader,
    Loader,
} from 'rsuite';
import axios from 'axios';
import {Image, Edit, Trash, Search } from '@rsuite/icons';

const Product = () => {

    // const [selectValue, setSelectValue] = useState('')
	const [formValue,setFormValue] = useState({})
    const [searchTerm, setSearchTerm] = useState('')
	const [isEditing, setIsEditing] = useState(false);
    const [hasFile, setHasFile] = useState(null)
    const [listProduct, setListProduct] = useState([])
    const [file, setFile] = useState(null)
	const formRef = useRef()
	const [open, setOpen] = useState(false);

    //uplod file 
    const [uploading, setUploading] = useState(false);
    const [fileInfo, setFileInfo] = useState(null);

	const handleOpen = () => {
        setHasFile(null)
        setIsEditing(false)
        setFormValue({})
        setFile(null)
        setFileInfo(null);
        setOpen(true)
    };
	const handleClose = () => {
        setOpen(false)
    }; 

	// form rules
	const requiredStr =Schema.Types.StringType().isRequired('Ce champ est obligatoire.')
	const requiredInt =Schema.Types.NumberType().isRequired('Ce champ est obligatoire.')

    // My functions


    function previewFile(file, callback) {
        const reader = new FileReader();
        reader.onloadend = () => {
          callback(reader.result);
        };
        reader.readAsDataURL(file);
      }

    const handleSubmit = ()=>{
        const formdata = new FormData()
        if(!formRef.current.check()){
            console.error("Form error")
            return;
        }
        console.log(file);
        if (isEditing) {
            formdata.append('id', formValue.id)            
        }
        
        formdata.append('libelle_prod', formValue.libelle_prod)
        formdata.append('prix_unit', formValue.prix_unit)
        formdata.append('image', file)
        
        
        postProduct(formdata, hasFile)
        setFormValue({})
        handleClose()
    }

    const handleEdit = (data) => {
        setIsEditing(true);
        // check if there is an image associate to the product
        setHasFile(null)
        
        if (data.image) {
            setHasFile(data.image)
            setFileInfo(`http://localhost:3001/getImages/${data.image}`)
        }
        setFormValue({
            id : data.id_prod,
            libelle_prod : data.libelle_prod,
            prix_unit : data.prix_unit,
        });
        
        
        setOpen(true);
    };

    const deleteProduct = async (id, filename) => {

        const data = {filename : filename}
        
        try {
            const response = await axios.delete(`http://localhost:3001/product/${id}`, {
                params : data
            });
            toaster.push(messageDelete, { placement, duration: 5000 });
            getProduct()
        } catch (error) {
            console.error('Erreur de Suppression:', error);
        }
    };

    const onFileChange = (file) => {
        if (file && file.length > 0) {
            const MyFile = file[0].blobFile; // Le fichier sélectionné
            setFile(MyFile);
            
          }
    };

    useEffect(()=>{
        getProduct()
    },[])

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
        
        const postProduct = async (data, oldImage =null) => {
            try {
                if(isEditing){
                    const id = data.get('id');
                const response = await axios.put(`http://localhost:3001/product/${id}`, data,{
                    headers: {
                      'Content-Type': 'multipart/form-data',
                    },
                    params : {oldImage}
                  });

                toaster.push(messageAdd, { placement, duration: 5000 });
                }else{
                const response = await axios.post('http://localhost:3001/product', data,{
                    headers: {
                      'Content-Type': 'multipart/form-data',
                    },
                  });
                  
                toaster.push(<Message showIcon type="success">{response.data}</Message>, { placement, duration: 5000 });
                }
                getProduct(); // Recharger les données après l'insertion
            } catch (error) {
                console.log(error);
                
                console.error('Erreur lors de l\'envoi des données:', error);
            }
        };
    
        const getProduct = async () => {
            try {
                const response = await axios.get('http://localhost:3001/product');
                setListProduct(response.data);
    
                
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
            }
        };
        
        // useEffect(()=>{
        //    console.log(filteredData);
        // },[])
    // ------------------------ D A T A B A S E  R E Q U E S T ----------------------------//
    
    
    // ------------------------ F O R  T A B L E ----------------------------//
        
        // Filtrer les données en fonction du texte de recherche
        const filteredData = listProduct.filter(item => 
            item.libelle_prod.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
    // ------------------------ F O R  T A B L E ----------------------------//
    // contenu de mon formulaire
    function myContent(){
		return <Form
        ref={formRef}
        onChange={setFormValue}
        formValue={formValue}
        model={Schema.Model({ 
            libelle_prod: requiredStr, 
            prix_unit: requiredInt,
        })}
        >
            <Grid fluid>
                <Row gutter={8}>
                    <Col>
                    <Form.Group controlId="libelle_prod">
                    <Form.ControlLabel>
                        Libelle produit
                    </Form.ControlLabel>
                    <Form.Control name="libelle_prod"/>
                </Form.Group>
                    </Col>
                    <Col>
                    <Form.Group controlId="prix_unit">
                    <Form.ControlLabel>
                        prix unitaire
                    </Form.ControlLabel>
                    <Form.Control name ="prix_unit" accepter={InputNumber} />
                </Form.Group>
                    </Col>
                </Row>
                <Row>
                <Form.Group controlId="nbr_bed">
                    <Form.ControlLabel>
                        Image
                    </Form.ControlLabel>
                    <Uploader
                        fileListVisible={false}
                        listType="picture"
                        action="http://localhost:3001/upload"
                        onUpload={file => {
                            setUploading(true);
                            previewFile(file.blobFile, value => {
                            setFileInfo(value);
                            });
                        }}
                        onSuccess={(response, file) => {
                            setUploading(false);
                            toaster.push(<Message type="success">Uploaded successfully</Message>);
                            console.log(response);
                        }}
                        onError={() => {
                            setFileInfo(null);
                            setUploading(false);
                            toaster.push(<Message type="error">Upload failed</Message>);
                        }}
                        onChange={onFileChange}
                        >
                    <button style={{ width: 150, height: 150 }}>
                        {uploading && <Loader backdrop center />}
                        {fileInfo ? (
                        <img src={fileInfo} width="100%" height="100%" />
                        ) : (
                        <Image style={{ fontSize: 80 }} />
                        )}
                    </button>
                    </Uploader>
                </Form.Group>
                </Row>
                
            </Grid>
    </Form>
	}
    return(
    <div>
        <div className="main-wrapper">
            {/* Sidebar */}
            <SideBar />
            <CustomModal title={isEditing ? "Modifier une produit" : "Ajouter un produit"} open={open} handleClose={handleClose} handleSubmit={handleSubmit} content = {myContent}/>
            <div className="page-wrapper">
                <div className="content container-fluid">
                    <div className="page-header">
                    <div className="row align-items-center">
						<div className="col">
							<div className="mt-5">
								<h4 className="blank_title float-left mt-2">Produits</h4> <a href="#" className="btn btn-primary float-right veiwbutton" onClick={handleOpen}>Ajouter un produit</a> </div>
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

                            <Table.Column width={100} align="center" >
                                <Table.HeaderCell>Image</Table.HeaderCell>
                                <Table.Cell>
                                {rowData => (
                                    <div
                                        style={{
                                            width: 40,
                                            height: 40,
                                            background: '#f5f5f5',
                                            borderRadius: 6,
                                            marginTop: 2,
                                            overflow: 'hidden',
                                            display: 'inline-block'
                                        }}
                                    >
                                        <img 
                                            src={rowData.image ?`http://localhost:3001/getImages/${rowData.image}` : `http://localhost:3001/getImages/produit.png`} 
                                            width="40" 
                                            alt="Produit" 
                                        />
                                    </div>
                                )}
                            </Table.Cell>

                            </Table.Column>
                            <Table.Column width={300} align="center" >
                                <Table.HeaderCell>Produit</Table.HeaderCell>
                                <Table.Cell dataKey='libelle_prod'/>
                            </Table.Column>
                            <Table.Column width={300} align="center" >
                                <Table.HeaderCell>Prix unitaire</Table.HeaderCell>
                                <Table.Cell>
                                    {rowData => `${rowData.prix_unit} Ar`}
                                </Table.Cell>
                            </Table.Column>
                            <Table.Column width={200} align="center" fixed="right">
                                <Table.HeaderCell>Action</Table.HeaderCell>

                                <Table.Cell style={{ padding: '6px' }}>
                                {rowData => (
                                    <>
                                    <IconButton icon={<Edit color='green'/>} onClick={()=>{ handleEdit(rowData) }}/>
                                    <IconButton  icon={<Trash color='red'/>} onClick={()=>{deleteProduct(rowData.id_prod, rowData.image)}}/>
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
    </div>)
};

export default Product;