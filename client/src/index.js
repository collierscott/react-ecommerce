import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import 'gestalt/dist/gestalt.css';
import App from './components/App';
import Checkout from './components/Checkout';
import Signin from  './components/Signin';
import Signup from './components/Signup';
import Navbar from './components/Navbar';
import registerServiceWorker from './registerServiceWorker';

const Root = () => (
  <Router>
    <Fragment>
      <Navbar />
      <Switch>
        <Route exact component={App} path="/" />
        <Route component={Signin} path="/signin" />
        <Route component={Signup} path="/signup" />
        <Route component={Checkout} path="/checkout" />
      </Switch>
    </Fragment>
  </Router>
);

ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();

//hot reloading
if(module.hot) {
  module.hot.accept();
}
