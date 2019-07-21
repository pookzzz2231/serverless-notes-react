import React from "react";
import { Route } from "react-router-dom";

// export as default obj (JSX) pure stateless < Route /> JSX component
// which uses a closure function with 3 arguments
// basically we create a func which returns new Route 
// that renders component with all props passed in from parent
export default ({ component: C, props: cProps, ...rest }) => (
  // Instead of using component prop, use render to render JSX manually 
  // render function has access to all route props 
  // (match, location and history) as the same as component prop
  // -> we wanna keep that for our component rendering 
  // and also spread whatever passed in from parent (cProps)
  <Route {...rest} render={routeProps => {
    return <C {...routeProps} {...cProps} />;
  }} />
);
