import React from "react";
import { Route, Switch } from "react-router-dom";
import AppliedRoute from "./components/AppliedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import Home from "./containers/Home";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import NotFound from "./containers/NotFound";
import CreateNote from "./containers/CreateNote";
import Note from "./containers/Note";


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
    <UnauthenticatedRoute path="/login" exact component={Login} props={childProps} />
    <UnauthenticatedRoute path="/signup" exact component={Signup} props={childProps} />
    <AuthenticatedRoute path="/notes/new" exact component={CreateNote} props={childProps} />
    {/* will send all matching routes to Notes including notes/new 
    -> make sure this comes after notes/new */}
    <AuthenticatedRoute path="/notes/:id" exact component={Note} props={childProps} />

    { /* Finally, catch all unmatched routes */}
    <Route component={NotFound} />
  </Switch>;
