import React, { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Auth } from "aws-amplify";
import Routes from "./Routes";
import "./styles/App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      // ensure that the rest of our app is only ready to go 
      // after async Auth process is done
      isAuthenticating: true
    };
  }

  // runs after component mounted 
  // and re-trigger render if state is set in here
  async componentDidMount() {
    try {
      // Amplify get session from localStorage
      await Auth.currentSession();
      this.userHasAuthenticated(true);

    } catch (e) {
      // Auth.currentSession();
      // will throw 'No current user' if nobody is currently logged in
      if (e !== 'No current user') {
        alert(e);
      }
    }

    this.setState({ isAuthenticating: false });
  }

  // arrow func, this will always bind to parent Obj (App)
  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }

  handleLogout = async event => {
    // destroy session in localStorage
    await Auth.signOut();
    this.userHasAuthenticated(false);
    // can use history props from router 
    // since it will be exported with 'withRouter' Router HOC
    this.props.history.push("/login");
  }

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    };

    return (
      !this.state.isAuthenticating &&
      // all common navbar
      <div className="App container">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">Scratch</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              {/* check login state and display buttons */}
              {this.state.isAuthenticated
                ? <NavItem onClick={this.handleLogout}>Logout</NavItem>
                : <Fragment>
                  <LinkContainer to="/signup">
                    <NavItem>Signup</NavItem>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <NavItem>Login</NavItem>
                  </LinkContainer>
                </Fragment>
              }
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        {/* containers */}
        {/* will pass childProps in all route */}
        {/* will check match route in Route and render container */}
        <Routes childProps={childProps} />
      </div>
    );
  }
}

// App doesn't have access to router props
// because it is not rendered inside Route
// to use router props use withRouter
// which will give use Higher-Order Component (HOC)
// will pass updated match, location, 
// and history props to the wrapped component whenever it renders.
export default withRouter(App);
