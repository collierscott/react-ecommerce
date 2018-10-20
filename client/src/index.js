import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import 'gestalt/dist/gestalt.css';
import App from './components/App';
import Checkout from './components/Checkout';
import Signin from  './components/Signin';
import Signup from './components/Signup';
import Brews from './components/Brews';
import Navbar from './components/Navbar';
import {getToken} from "./utils";
import registerServiceWorker from './registerServiceWorker';

const PrivateRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render={props => (
        getToken() !== null ?
            <Component {...props} /> :
            <Redirect to={{
                pathname: '/signin',
                state: { from: props.location}
            }} />
    )} />
);

const Root = () => (
  <Router>
    <Fragment>
      <Navbar />
      <Switch>
        <Route exact component={App} path="/" />
        <Route component={Signin} path="/signin" />
        <Route component={Signup} path="/signup" />
        <PrivateRoute component={Checkout} path="/checkout" />
        <Route component={Brews} path="/:brandId" />
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
