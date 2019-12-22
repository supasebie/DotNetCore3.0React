import React from "react";
import ReactDOM from "react-dom";
import App from "./app/layout/App";
import "./app/layout/styles.css";
import * as serviceWorker from "./serviceWorker";
import { Router } from "react-router-dom";
import {createBrowserHistory} from 'history';
import ScrollToTop from "./app/layout/ScrollToTop";
import 'react-toastify/dist/ReactToastify.min.css';

export const history = createBrowserHistory();

ReactDOM.render(
  <Router history={history}>
    <ScrollToTop>
      <App />
    </ScrollToTop>
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
