import React from 'react';
import Home from './pages/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Room from './pages/Room';
import Product from './pages/Product';
import Store from './pages/Store';
import Book from './pages/Book';
import Clients from './pages/Clients';
const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/room' element={<Room/>}/>
      <Route path='/product' element={<Product/>}/>
      <Route path='/store' element={<Store/>}/>
      <Route path='/book' element={<Book/>}/>
      <Route path='/client' element={<Clients/>}/>
    </Routes>
    </BrowserRouter>
  );
};

export default App;