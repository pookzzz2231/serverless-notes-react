import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router } from "react-router-dom";
import Amplify from "aws-amplify";

const {
  REACT_APP_API_URL: URL,
  REACT_APP_AWS_REGION: REGION,
  REACT_APP_COGNITO_APP_CLIENT_ID: APP_CLIENT_ID,
  REACT_APP_COGNITO_IDENTITY_POOL_ID: IDENTITY_POOL_ID,
  REACT_APP_COGNITO_USER_POOL_ID: USER_POOL_ID,
  REACT_APP_S3_BUCKET: BUCKET
} = process.env;

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: REGION,
    userPoolId: USER_POOL_ID,
    identityPoolId: IDENTITY_POOL_ID,
    userPoolWebClientId: APP_CLIENT_ID
  },
  Storage: {
    region: REGION,
    bucket: BUCKET,
    identityPoolId: IDENTITY_POOL_ID
  },
  API: {
    endpoints: [
      {
        name: "notes",
        endpoint: URL,
        region: REGION
      },
    ]
  }
});

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
