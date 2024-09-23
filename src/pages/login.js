import axios from 'axios';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom';

const Login = ({setToken}) => {

	const [userName, setUserName] = useState('')
	const [password, setPassword] = useState('')
	const [typeInput, setTypeInput] = useState('password')
	const [icon, setIcon] = useState('fas fa-solid fa-eye')
	const navigate = useNavigate()

	const logUser = async (userName, password) => {
		const data = {userName,password}
		try{
			const response = await axios.post(`http://localhost:3001/login/`,data)
			setToken(response.data);
			navigate('/')
			
			
		}catch (error){
			console.error(error);
		}
		
	}

	const handleChangeType = ()=>{
		const newType = typeInput =="password" ? "text" : "password"
		setTypeInput(newType)
		setIcon(newType=="password" ? 'fas fa-solid fa-eye': 'fa fa-eye-slash')
	}


    const handleSubmit = (e)=>{
		e.preventDefault();
		if(!userName || !password){
			alert("Veillez remplir les champs s'il vous plaît")
			return
		}
		logUser(userName, password)		
    }
    return (
        <div>
            <div className ="main-wrapper login-body">
		<div className ="login-wrapper">
			<div className ="container">
				<div className ="loginbox">
					<div className ="login-left"> <img className ="img-fluid" src="assets/img/hotel_logo.jpg" style={{borderRadius:"50%"}} alt="Logo"/> </div>
					<div className ="login-right">
						<div className ="login-right-wrap">
							<h1>Connexion</h1>
							<form onSubmit={handleSubmit}>
								<div className ="form-group">
									<input className ="form-control" type="text" placeholder="Identifiant" onChange={e => setUserName(e.target.value)}/> </div>
								<div className ="form-group">
									<div className='d-flex align-items-center border rounded-sm px-2'>
									<input className ="form-control border-0" type={typeInput} placeholder="Mot de passe" onChange={e => setPassword(e.target.value)}/> 
									<i className={icon} style={{cursor:"pointer"}} onClick={handleChangeType}></i>
									</div>
								</div>
								<div className ="form-group">
									<button className ="btn btn-primary btn-block" type="submit" >Se connecter</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
        </div>
    );
};

export default Login;

Login.propTypes = {
	setToken: PropTypes.func.isRequired
  }