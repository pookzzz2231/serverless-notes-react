import React, { Component } from "react";
import { API, Storage } from "aws-amplify";

export default class Notes extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      note: null,
      content: "",
      attachmentURL: null
    };
  }

  // when go to note/:id page -> call APi and render in compomentDidMount
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
        // will notes state later to edit note
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
    return API.get("notes", `/notes/${this.props.match.params.id}`);
  }

  render() {
    return <div className="Notes"></div>;
  }
}