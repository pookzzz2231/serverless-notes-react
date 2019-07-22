import React, { Component } from "react";
import { API } from "aws-amplify";
import s3Upload from "../utils/AWS-S3";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "../styles/CreateNote.css";

const MAX_SIZE = process.env.REACT_APP_MAX_ATTACHMENT_SIZE;

export default class CreateNote extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: null,
      content: ""
    };
  }

  validateForm() {
    return this.state.content.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleFileChange = event => {
    // save file in props instead of state
    // because file does not need to change or update rendering component
    this.file = event.target.files[0];
  }

  handleSubmit = async event => {
    event.preventDefault();

    // if file exists and size too large
    if (this.file && this.file.size > MAX_SIZE) {
      alert(`Please pick a file smaller than ${MAX_SIZE / 1000000} MB.`);
      return;
    }

    this.setState({ isLoading: true });

    try {
      // check attachment file when submit -> get back S3 Key
      const attachment = this.file ? await s3Upload(this.file) : null;

      // then await for createNote promise to resolve -> POST API
      await this.createNote({
        // when upload file's data value will be at S3 key
        // post { attachment: S3_key } to API -> will save in Dynamo DB
        // S3_key is a file name
        attachment,
        content: this.state.content
      });

      this.props.history.push("/");
    } catch (e) {
      console.log(e);
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  createNote(note) {
    // post to API name -> "notes"; config in Amplify.configure in index.js
    // post to "/notes"
    // pass in { content: ... } as body
    // will return a promise
    return API.post("notes", "/notes", {
      body: note
    });
  }

  render() {
    return (
      <div className="NewNote">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="content">
            <FormControl
              onChange={this.handleChange}
              value={this.state.content}
              componentClass="textarea"
            />
          </FormGroup>
          <FormGroup controlId="file">
            <ControlLabel>Attachment</ControlLabel>
            <FormControl onChange={this.handleFileChange} type="file" />
          </FormGroup>
          <LoaderButton
            block
            bsStyle="primary"
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Create"
            loadingText="Creating…"
          />
        </form>
      </div>
    );
  }
}