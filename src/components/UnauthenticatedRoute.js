// page visited for non-user
// UnauthenticatedRoute will check logged in user for re-enter logIn and Signup page
import React from "react";
import { Route, Redirect } from "react-router-dom";

const querystring = (name, url = window.location.href) => {
  name = name.replace(/[[]]/g, "\\$&");

  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i");
  const results = regex.exec(url);
  // redirect === "" || redirect === null ? "/" : redirect
  if (!results || !results[2]) {
    return "/";
  }

  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// React cannnot destructuring component JSX; component: C
export default ({ component: C, props, ...rest }) => {
  // get redirect path for non-user attempting to navigate to page that need auth before login
  // eg: /notes/:id
  const redirect = querystring("redirect");

  return (
    < Route
      {...rest}
      render={
        routeProps =>
          // user not logged in -> render container component
          // -> render loggin, signin
          // with redirect path, if user had tried to access page required auth before redirect to login; ie /notes/:id
          !props.isAuthenticated ?
            <C {...routeProps} {...props} />
            // user already logged in -> go to home
            // user logged in with redirect path -> go to redirect path
            : < Redirect to={redirect} />
      }
    />
  )
}