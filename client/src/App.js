import React from 'react';
import { Switch, Route } from 'react-router-dom';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from './components/navbar/Navbar';
import ProductList from './components/product/product-list/ProductList';
import Details from './components/product/details/Details';
import Cart from './components/cart/Cart';
import Default from './components/default/Default';
import Modal from './components/product/modal/Modal';
import Support from './components/support/support1';
import Signup from './components/support/Signup';
import Admin from './components/support/admin';

function App() {
  return (
    <>
      <Navbar />
      <Switch>
        <Route exact path="/" component={ProductList} />
        <Route exact path="/details" component={Details} />
        <Route exact path="/cart" component={Cart} />
        <Route exact path="/support" component={Signup} />
        <Route exact path="/chat" component={Support} />
        <Route exact path="/admin" component={Admin} />
        <Route component={Default} />
      </Switch>
      <Modal />
    </>
  );
}

export default App;
