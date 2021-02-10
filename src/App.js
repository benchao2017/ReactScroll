import React, {lazy, Suspense} from 'react';
import './styles.css';
import 'intersection-observer';
import { Switch, Route } from 'react-router-dom';
import LoadingScreen from './components/LoadingScreen'

export default function App() {
  return (
      <Suspense fallback={<LoadingScreen />}>
        <Switch>
          <Route exact path="/" component={lazy(()=>import('./components/mainPage'))} />
          <Route path="/user/:email" component={lazy(()=>import('./components/mainPage'))} />
          <Route path="/admin/control/:email" component={lazy(()=>import('./components/admin/control'))} />
          <Route path="/admin"  component={lazy(()=>import('./components/admin'))} />
          <Route path="/email" component={lazy(()=>import('./components/email'))} />
          <Route path="/list" component={lazy(()=>import('./components/clients'))} />
        </Switch>
      </Suspense>
  );
}
