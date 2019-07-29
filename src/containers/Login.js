import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { Auth } from "aws-amplify";
import "../styles/Login.css";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      email: "",
      password: ""
    };
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({ isLoading: true });
    // let user;

    try {
      await Auth.signIn(this.state.email, this.state.password);
      this.props.userHasAuthenticated(true);

      // Login component is rendered using a Route, 
      // so it will also has Router props
      // which has history as one of the prop 
      // which comes with push method
      // -> history prop stores routes url in our App
      // this.props.history.push("/");

      // updated: redirect is handled in UnauthenticateRoute
    } catch (e) {
      alert(e.message);

      // set state isLoading here inside the block to make sure
      // if set out of try catch blocks means setting out of async then... catch...
      // will cause memory leak in React
      this.setState({ isLoading: false });
    }

    // !!DO NOT set state here; outside of try then catch block
    // this will make react render component after async block triggers
    // which then will render this component after redirect and render another component
    // which cause memory leak
  }

  render() {
    return (
      < div className="Login" >
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="email" bsSize="large">
            <ControlLabel>Email</ControlLabel>
            <FormControl
              autoFocus
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <LoaderButton
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Login"
            loadingText="Logging in…"
          />
        </form>
      </div >
    );
  }
}
