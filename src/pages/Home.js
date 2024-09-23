import React, { useEffect, useState } from 'react';
import SideBar from '../components/Sidebar';
import Breadcrumb from '../components/BreadCrumb';
import { Calendar, SelectPicker } from 'rsuite';
import axios from 'axios';
const Home = () => {
	const [listBook, setListBook] = useState([])
	const [listStatistic, setListStatistic] = useState([])
	const [listRoom, setListRoom] = useState([])
	const [selectValue, setSelectValue] = useState([])
	// my functions

	const convertToDate = (dateString) => new Date(dateString);

	// Vérifie si la date fait partie de la plage d'une réservation
	const isDateReserved = (date) => {
		return listBook.some((reservation) => {
		  const startDate = convertToDate(reservation.date_arrive);
		  const endDate = convertToDate(reservation.date_depart);
		  return date >= startDate && date <= endDate;
		});
	  };


	const getBook = async (id) =>{
		try{
			const response = await axios.get(`http://localhost:3001/book/home/${id}`);
			setListBook(response.data)
		}catch(error){
			console.error('Erreur lors de la récupération des données:', error);
		}
		
	  }

	const handleChange = (value)=>{
		getBook(value)
	}
	  
	  
  const getRoom = async () => {
    try {
        const response = await axios.get('http://localhost:3001/room');
		setListRoom(response.data.map(item=>({label : `Chambre ${item.num_room} `, value : item.id_room})));
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
    }
	};
	  const getStatistic = async () =>{
		try{
			const response = await axios.get(`http://localhost:3001/statistic/`);
			setListStatistic(response.data)
		}catch(error){
			console.error('Erreur lors de la récupération des données:', error);
		}
		
	  }
	  useEffect(()=>{
		getStatistic()
		getRoom()
	  },[])
	  
    return (


        <div>
			<style>
				{`
			.bg-gray {
				background-color: rgba(242, 242, 242, 0.3);
			}
			`}
			</style>
            <div className="main-wrapper">
		
		{/* SideBar */}
		<SideBar />
		{/* SideBar */}
		<div className="page-wrapper">
			<div className="content container-fluid">
				<div className="page-header">
					<div className="row">
						<div className="col-sm-12 mt-5">
							<h3 className="page-title mt-3">Bonjour à vous</h3>
							{/* Breadcrumb */}
							<Breadcrumb name="Tableau de bord"/>
						</div>
					</div>
				</div>
				{listStatistic.map(stat=>(
					<div className="row">
					
					<div className="col-xl-3 col-sm-6 col-12">
						<div className="card board1 fill">
							<div className="card-body">
								<div className="dash-widget-header">
									<div>
										<h3 className="card_widget_header">{stat.nbr_client}</h3>
										<h6 className="text-muted">Nombre de client</h6> </div>
									<div className="ml-auto mt-md-3 mt-lg-0"> <span className="opacity-7 text-muted"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#009688" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user-plus">
									<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
									<circle cx="8.5" cy="7" r="4"></circle>
									<line x1="20" y1="8" x2="20" y2="14"></line>
									<line x1="23" y1="11" x2="17" y2="11"></line>
									</svg></span> </div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-xl-3 col-sm-6 col-12">
						<div className="card board1 fill">
							<div className="card-body">
								<div className="dash-widget-header">
									<div>
										<h3 className="card_widget_header">{stat.nbr_room}</h3>
										<h6 className="text-muted">Chambre</h6> </div>
									<div className="ml-auto mt-md-3 mt-lg-0"> <span className="opacity-7 text-muted"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#009688" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-dollar-sign">
									<line x1="12" y1="1" x2="12" y2="23"></line>
									<path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
									</svg></span> </div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-xl-3 col-sm-6 col-12">
						<div className="card board1 fill">
							<div className="card-body">
								<div className="dash-widget-header">
									<div>
										<h3 className="card_widget_header">{stat.nbr_prod}</h3>
										<h6 className="text-muted">Produit</h6> </div>
									<div className="ml-auto mt-md-3 mt-lg-0"> <span className="opacity-7 text-muted"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#009688" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-plus">
									<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z">
									</path>
									<polyline points="14 2 14 8 20 8"></polyline>
									<line x1="12" y1="18" x2="12" y2="12"></line>
									<line x1="9" y1="15" x2="15" y2="15"></line>
									</svg></span> </div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-xl-3 col-sm-6 col-12">
						<div className="card board1 fill">
							<div className="card-body">
								<div className="dash-widget-header">
									<div>
										<h3 className="card_widget_header">{stat.nbr_book}</h3>
										<h6 className="text-muted">Reservation</h6> </div>
									<div className="ml-auto mt-md-3 mt-lg-0"> <span className="opacity-7 text-muted"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#009688" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-globe">
									<circle cx="12" cy="12" r="10"></circle>
									<line x1="2" y1="12" x2="22" y2="12"></line>
									<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z">
									</path>
									</svg></span> </div>
								</div>
							</div>
						</div>
					</div>
				</div>
				))}
				
				<div className="row">
					<div className="col-md-12 d-flex">
						<div className="card">
							<div className="card-header">
								<div className="row">
									<div className="col-md-6">
									<SelectPicker
									data={listRoom}
									searchable={false}
									value = {selectValue}
									placeholder="Choisir une chambre"
									name="chambre"
									onChange={(value) =>{
										setSelectValue(value)
										handleChange(value)
									}} // Mettre à jour l'état du formulaire
									/>
									</div>
									<div className="col-md-6 text-right"><h4>Status réservation</h4></div>
								</div>
								
							</div>
							<div className="card-body">
						{/* Calendar */}
						<Calendar 
						renderCell={(date) => {
							// Si la date tombe dans la plage de réservation, la colorer
							if (isDateReserved(date)) {
							  return (
								<div
								  style={{
									backgroundColor: 'salmon',
									borderRadius: '50%',
									width: '100%',
									height: '100%',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
								  }}
								>
								  {date.getDate()}
								</div>
							  );
							}
							// Retourne la cellule normale si la date n'est pas réservée
							return <span>{date.getDate()}</span>;
						  }}
						bordered 
						cellClassName={date => (date.getDay() % 2 ? 'bg-light' : undefined)} />
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

export default Home;