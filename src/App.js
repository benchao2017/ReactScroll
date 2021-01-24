import React from 'react';
import './styles.css';
import 'intersection-observer';
import { Switch, Route } from 'react-router-dom';
import Main from './components/mainPage';

export default function App() {
  return (
    <>
      <Switch>
        <Route exact path="/" component={Main} />
        <Route path="/:email" component={Main} />
      </Switch>
    </>
  );
}
