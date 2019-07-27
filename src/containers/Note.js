import React, { Component } from "react";
import { API, Storage } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { s3Upload, s3Remove } from "../utils/AWS-S3";
import "../styles/Note.css"

const MAX_ATTACHMENT_SIZE = process.env.MAX_ATTACHMENT_SIZE;

export default class Notes extends Component {
  constructor(props) {
    super(props);

    // file is props instead of state
    // because file does not need to change or update rendering component
    this.file = null;

    this.state = {
      isLoading: null,
      isDeleting: null,
      note: null,
      content: "",
      attachmentURL: null
    };
  }

  // when go to note/:id page -> after render -> componentDidMount()
  // call APi get response -> set state from response 
  // then re-render in compomentDidMount
  async componentDidMount() {
    try {
      let attachmentURL;

      // get note/:id for this user
      const note = await this.getNote();
      // response body
      const { content, attachment } = note;

      // valid attachment
      // attachment from body is name
      if (attachment) {
        // use amplify to get attachmentUrl from S3
        attachmentURL = await Storage.vault.get(attachment);
      }

      // set all retrives in setState
      this.setState({
        // will use note state later to edit note
        note,
        content,
        attachmentURL
      });
    } catch (e) {
      console.log(e)
      alert(e);
    }
  }

  getNote() {
    // this.props.match get params from URI
    return API.get("notes", `/notes/${this.props.match.params.id}`);
  }

  validateForm() {
    return this.state.content.length > 0;
  }

  formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }

  deleteNote() {
    // returns promise -> this can use try and await
    // delete at API, AWS-Amplify will send userId within event request
    // noteId will send to API from event.pathParameters.id; delete API path
    // API get userId and noteId then delete
    return API.del("notes", `/notes/${this.props.match.params.id}`);
  }

  handleDelete = async event => {
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    this.setState({ isDeleting: true });

    try {
      // call delete API and delete from param id
      await this.deleteNote();
      await s3Remove(this.state.note.attachment);
    } catch (error) {
      console.log(error);
      alert(error);
    }

    this.setState({ isDeleting: false });
    this.props.history.push("/");
  }

  saveNote(note) {
    // update to API using current URI params id 
    // /notes/:id -> this.props.match.params.id
    return API.put("notes", `/notes/${this.props.match.params.id}`, {
      body: note
    });
  }

  handleSubmit = async event => {
    let attachment;
    event.preventDefault();

    if (this.file && this.file.size > MAX_ATTACHMENT_SIZE) {
      alert(`Please pick a file smaller than ${MAX_ATTACHMENT_SIZE / 1000000} MB.`);
      return;
    }

    this.setState({ isLoading: true });

    try {
      // check new attachment file
      if (this.file) {
        // update file to new file on S3 when subbmitted
        attachment = await s3Upload(this.file);

        // successfully re-upload new file
        // then remove old file
        if (attachment) {
          // amplify Storage.vault retrive bucket name from config
          // amplify will automatically look up at bucket private/userId/ + fileName -> then remove file
          await s3Remove(this.state.note.attachment);
        }
      }

      await this.saveNote({
        content: this.state.content,
        // old attachment or new one
        attachment: attachment || this.state.note.attachment
      });
    } catch (e) {
      console.log(e)
      alert(e)
    }

    this.setState({ isLoading: false });
    this.props.history.push("/");
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleFileChange = event => {
    // file prop doesn't need re-render -> user prop instead of state
    this.file = event.target.files[0];
  }

  render() {
    return (
      <div className="Notes">
        {this.state.note &&
          <form onSubmit={this.handleSubmit}>
            <FormGroup controlId="content">
              <FormControl
                onChange={this.handleChange}
                value={this.state.content}
                componentClass="textarea"
              />
            </FormGroup>
            {this.state.note.attachment &&
              <FormGroup>
                <ControlLabel>Attachment</ControlLabel>
                <FormControl.Static>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={this.state.attachmentURL}
                  >
                    {this.formatFilename(this.state.note.attachment)}
                  </a>
                </FormControl.Static>
              </FormGroup>}
            <FormGroup controlId="file">
              {!this.state.note.attachment &&
                <ControlLabel>Attachment</ControlLabel>}
              <FormControl onChange={this.handleFileChange} type="file" />
            </FormGroup>
            <LoaderButton
              block
              bsStyle="primary"
              bsSize="large"
              disabled={!this.validateForm()}
              type="submit"
              isLoading={this.state.isLoading}
              text="Save"
              loadingText="Saving…"
            />
            <LoaderButton
              block
              bsStyle="danger"
              bsSize="large"
              isLoading={this.state.isDeleting}
              onClick={this.handleDelete}
              text="Delete"
              loadingText="Deleting…"
            />
          </form>}
      </div>
    );
  }
}