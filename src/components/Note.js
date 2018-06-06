import React, { Component } from "react";
import Editor from "./Editor";
import moment from "moment";
import "moment/locale/zh-cn";
import { loadCollection, db } from "../database";
import _ from "loadsh";
moment.locale("zh-CN");
class Note extends Component {
  /**
   * 笔记模块，笔记模块展示。
   *
   * @module  Note
   */
  state = {
    entity: this.props.entity,
    body: this.props.entity.body,
    updated: this.props.entity.meta.updated || this.props.entity.created,
    open: false,
    destroyEntity: this.props.destroyEntity
  };
  /**
   * @method updated
   * @param {}
   * @return {String}  返回格式化后的日期
   */
  updated() {
    return moment(this.state.updated).fromNow();
  }
  /**
   * @method header
   * @param {}
   * @return {String}  返回笔记标题（截取30个字符）
   */
  header() {
    return _.truncate(this.state.body, { length: 30 }) || " 新建笔记 ";
  }
  /**
   * @method words
   * @param {}
   * @return {String}  返回文字长度
   */
  words() {
    return this.state.body.length;
  }
  /**
   * 切换笔记详情的显示隐藏
   * @method toggle
   * @param {}
   * @return {}
   */
  toggle = () => {
    this.setState(prevState => {
      return {
        open: !prevState.open
      };
    });
  };
  /**
   * 更新笔记内容保存到数据库
   * @method updateEntity
   * @param {value} 当前笔记
   * @return {}
   */
  updateEntity = event => {
    const _body = event.target.value;
    this.setState({
      body: _body
    });
    loadCollection("notes").then(collection => {
      const entity = this.state.entity;
      entity.body = _body;
      collection.update(entity);
      db.saveDatabase();
    });
  };

  render() {
    return (
      <div className="item">
        <div className="meta">{this.updated()}</div>
        <div className="content">
          <div className="header" onClick={this.toggle}>
            {this.header()}
          </div>
          <div className="extra">
            {this.state.open && (
              <Editor
                entity={this.state.entity}
                updateEntity={this.updateEntity}
              />
            )}
            {this.words()}字
            {this.state.open && (
              <i
                className="right floated trash  icon"
                onClick={() => this.state.destroyEntity(this.state.entity)}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}
export default Note;
