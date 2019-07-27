import React, { Component } from "react";
import { API } from "aws-amplify";
// import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import "../styles/Home.css";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      notes: []
    };
  }

  async componentDidMount() {
    // for non-user -> return
    if (!this.props.isAuthenticated) {
      return;
    }

    // for user -> get data
    try {
      const notes = await this.getAllNotes();
      this.setState({ notes });
    } catch (e) {
      alert(e);
    }

    // after ger all note -> stops isLoading
    this.setState({ isLoading: false });
  }

  // get user's all notes
  getAllNotes() {
    return API.get("notes", "/notes");
  }

  // render each note
  renderNotesList(notes) {
    return [{}].concat(notes).map(
      (note, i) =>
        i !== 0
          ? <LinkContainer
            // each react list need unique key
            key={note.noteId}
            // link url to each notes/:noteId
            to={`/notes/${note.noteId}`}
          >
            <ListGroupItem header={note.content.trim().split("\n")[0]}>
              {"Created: " + new Date(note.createdAt).toLocaleString()}
            </ListGroupItem>
          </LinkContainer>
          : <LinkContainer
            key="new"
            to="/notes/new"
          >
            <ListGroupItem>
              <h4>
                <b>{"\uFF0B"}</b> Create a new note
                </h4>
            </ListGroupItem>
          </LinkContainer>
    );
  }

  // render for non-user
  renderLander() {
    return (
      <div className="lander">
        <h1>Notes</h1>
        <p>A Note taking app</p>
        <div>
          <div>
            <h3>Please signup or login</h3>
          </div>
          {/* <Link to="/login" className="btn btn-info btn-lg">
            Login
          </Link>
        </div>
        <div>
          <Link to="/signup" className="btn btn-success btn-lg">
            Signup
          </Link> */}
        </div>
      </div>
    );
  }

  // render for users -> call renderNotesList with this.state.notes
  renderNotes() {
    return (
      <div className="notes">
        <PageHeader>Your Notes</PageHeader>
        {/* after done loading render each note array */}
        <ListGroup>
          {!this.state.isLoading && this.renderNotesList(this.state.notes)}
        </ListGroup>
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        {this.props.isAuthenticated ? this.renderNotes() : this.renderLander()}
      </div>
    );
  }
}
