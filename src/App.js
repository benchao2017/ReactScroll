import React from 'react';
import './styles.css';
import 'intersection-observer';
import { Switch, Route } from 'react-router-dom';
import Main from './components/mainPage';
import Admin from './components/admin'
import Control from './components/admin/control'

export default function App() {
  return (
    <>
      <Switch>
        <Route exact path="/" component={Main} />
        <Route path="/user/:email" component={Main} />
        <Route path="/admin/control/:email" component={Control} />
        <Route path="/admin" component={Admin} />
      </Switch>
    </>
  );
}
