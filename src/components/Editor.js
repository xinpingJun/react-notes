import React, { Component } from "react";

class Editor extends Component {
  /**
  *
  * 编辑框
  * 
  @module Editor
  */
  state = {
    entity: this.props.entity,
    body: this.props.entity.body,
    updateEntity: this.props.updateEntity
  };
  render() {
    return (
      <div className="ui form ">
        <div className="field">
          <textarea
            rows="5"
            placeholder="写点东西记录下来。。"
            defaultValue={this.state.body}
            onInput={event => this.state.updateEntity(event)}
          />
        </div>
      </div>
    );
  }
}
export default Editor;
