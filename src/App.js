import React from 'react';
import './styles.css';
import 'intersection-observer';
import { Switch, Route } from 'react-router-dom';
import Main from './components/mainPage';
import Admin from './components/admin'
import Email from './components/email'
import Clients from './components/clients'
import Control from './components/admin/control'

export default function App() {

  (async () => {
    try{
    if ('ResizeObserver' in window === false) {
      // Loads polyfill asynchronously, only if required.
      const module = await import('@juggle/resize-observer');
      window.ResizeObserver = module.ResizeObserver;
    }
    // Uses native or polyfill, depending on browser support.
    const ro = new ResizeObserver((entries, observer) => {
      console.log('Something has resized!');
    });
  }catch{}
  })();

  return (
    <>
      <Switch>
        <Route exact path="/" component={Main} />
        <Route path="/user/:email" component={Main} />
        <Route path="/admin/control/:email" component={Control} />
        <Route path="/admin" component={Admin} />
        <Route path="/email" component={Email} />
        <Route path="/list" component={Clients} />
      </Switch>
    </>
  );
}
