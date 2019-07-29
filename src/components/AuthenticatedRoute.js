// page for only auth user
// AuthenticatedRoute is for checking auth user when access page require auth
import React from "react";
import { Route, Redirect } from "react-router-dom";

// React cannnot destructuring component JSX; component: C
// ...rest is path and other stuff in <AuthenticatedRoute ... />
export default ({ component: C, props, ...rest }) => {
  const loggedIn = props.isAuthenticated;

  return (
    <Route
      {...rest}
      // specify render func to render based on condition
      // routeProps has match, location and history props
      render={
        routeProps =>
          loggedIn ?
            // if logged in -> render current container
            // render all passed in props and router props; 
            // match, location and history
            <C {...routeProps} {...props} />
            // redirect to logged in container if not logged in
            : <Redirect
              // when navigate to auth page; ie /notes/:id
              // will redirect to /login?redirect=/notes/:noteId
              // then after logged in, we will redirect back to /notes/:noteId page
              to={`/login?redirect=${routeProps.location.pathname}${routeProps.location.search}`}
            />
      }
    />
  )
}