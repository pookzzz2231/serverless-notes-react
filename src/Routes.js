import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import Login from "./containers/Login";
import NotFound from "./containers/NotFound";
import AppliedRoute from "./components/AppliedRoute";

// will pass in childProps for login state in App.js
// then AppliedRoute will spread childProps and all other props
// and return <Route .... /> with render func which will render named component
export default ({ childProps }) =>
  // will render page below navbar based on route (url)
  <Switch>
    {/* AppliedRoute takes in { component: Home, props: ChildProps, ...rest } */}
    {/* Then convert to: */}
    {/* <Route {...rest} render={routeProps => <Home ...routeProps ...childProps />} /> */}
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <AppliedRoute path="/login" exact component={Login} props={childProps} />
    { /* Finally, catch all unmatched routes */}
    <Route component={NotFound} />
  </Switch>;
