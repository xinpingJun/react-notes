import React, { Component } from "react";
import Note from "./Note";
import { loadCollection, db } from "../database";

class Notes extends Component {
  /**
   * 主模块 ，笔记列表
   *
   * @module  Notes
   */
  constructor(props) {
    super(props);
    this.getInitialData();
  }
  state = {
    entities: []
  };
  /**
   * 获取数据库数据
   * @method getInitialData
   * @param {}
   * @return {}
   */
  getInitialData() {
    loadCollection("notes").then(collection => {
      const entities = collection
        .chain()
        .find()
        .simplesort("$loki", "isdesc")
        .data();
      this.setState({
        entities
      });
    });
  }
  /**
   * 创建笔记保存到数据库
   * @method createEntity
   * @param {}
   * @return {}
   */
  createEntity = () => {
    loadCollection("notes").then(collection => {
      const entity = collection.insert({
        body: ""
      });
      db.saveDatabase();
      this.setState(prevState => {
        const _entities = prevState.entities;
        _entities.unshift(entity);
        return {
          entities: _entities
        };
      });
    });
  };
  /**
   * 删除笔记
   * @method destroyEntity
   * @param {}
   * @return {}
   */
  destroyEntity = entity => {
    const _entities = this.state.entities.filter(_entity => {
      return _entity.$loki !== entity.$loki;
    });
    this.setState({
      entities: _entities
    });
    loadCollection("notes").then(collection => {
      collection.remove(entity);
      db.saveDatabase();
    });
  };
  render() {
    const entities = this.state.entities;
    const noteItems = entities.map(entity => (
      <Note
        key={entity.$loki}
        entity={entity}
        destroyEntity={this.destroyEntity}
      />
    ));
    return (
      <div className="ui container notes">
        <h4 className="ui horizontal divider header">
          <i className="bug icon" /> XinPing Notes App _ React.js
        </h4>
        <button
          className="ui right floated basic blue  button"
          onClick={this.createEntity}
        >
          添加笔记
        </button>
        <div className="ui divied items">
          {noteItems}
          {!entities.length && (
            <span className="ui small disabled header">
              还没有笔记，请按下 '添加笔记' 按钮。
            </span>
          )}
        </div>
      </div>
    );
  }
}
export default Notes;
