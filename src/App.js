import React, { useState } from 'react';
import Home from './pages/Home';
import { BrowserRouter, Routes, Route, Navigate  } from 'react-router-dom';
import Room from './pages/Room';
import Product from './pages/Product';
import Store from './pages/Store';
import Book from './pages/Book';
import Clients from './pages/Clients';
import RoomType from './pages/RoomType';
import Login from './pages/login';
import ListStore from './pages/ListStore';

function setToken(userToken) {
  sessionStorage.setItem('token', JSON.stringify(userToken))
}

function getToken() {
  const tokenString = sessionStorage.getItem('token');
  const userToken = JSON.parse(tokenString);
  return userToken?.token
}

const App = () => {

  const ProtectedRoute = ({ children }) => {
    const token = getToken();
  
    if (!token) {
      // Redirige vers la page de login si pas de token
      return <Navigate to="/login" />;
    }
  
    return children;
  };


  return (
    <BrowserRouter>
      <Routes>
          <Route path='/login' element={<Login setToken={setToken} />} />
          <Route path='/' element={ <ProtectedRoute> <Home /> </ProtectedRoute> } />
          <Route path='/room' element={ <ProtectedRoute> <Room /> </ProtectedRoute> } />
          <Route path='/product' element={<ProtectedRoute> <Product />  </ProtectedRoute> } />
          <Route path='/store' element={ <ProtectedRoute> <Store /> </ProtectedRoute> } />
          <Route path='/book' element={ <ProtectedRoute> <Book /> </ProtectedRoute> } />
          <Route path='/client' element={ <ProtectedRoute> <Clients /> </ProtectedRoute> } />
          <Route path='/listStore' element={ <ProtectedRoute> <ListStore /> </ProtectedRoute> } />
          <Route path='/roomType' element={ <ProtectedRoute> <RoomType /> </ProtectedRoute> } />
      </Routes>
    </BrowserRouter>
  );
};

export default App;