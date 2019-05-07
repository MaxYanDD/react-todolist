import React, { Component } from "react";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [
        { id: 1, isCompleted: true, content: "JavaScript" },
        { id: 2, isCompleted: false, content: "CSS" },
        { id: 3, isCompleted: true, content: "HTML" }
      ],
      newTodo: "", //新增todo的value
      editID: -1, //当前编辑状态的id
      editContent: "", //编辑状态的value
      remain: 0,
      hash: ""
    };
  }
  //计算未完成数量
  computeRemain() {
    let num = 0;
    this.state.todos.forEach(todo => {
      if (!todo.isCompleted) {
        num++;
      }
    });
    this.setState({
      remain: num
    });
  }


  //双向绑定新任务输入框
  inputHandler(e) {
    this.setState({
      newTodo: e.target.value
    });
  }
  //按回车键时执行添加新任务到列表
  submit(e) {
    console.log("触发");
    let { newTodo, todos } = this.state;
    //阻止页面跳转
    e.preventDefault();
    //如果用户输入为空就返回
    if (newTodo.trim() === "") return;
    //生成新的todo对象，插入到todos中
    //获取最大的ID
    let maxID = 0;
    todos.forEach(todo => {
      if (todo.id > maxID) maxID = todo.id;
    });
    todos.push({
      id: ++maxID,
      isCompleted: false,
      content: newTodo
    });
    this.computeRemain();
    // 更新state的状态，通过对象直接修改后，要执行这句话
    this.setState({
      newTodo: ""
    });
  }
  //双击todo进入编辑状态,并获得焦点
  editChoice(e, todo) {
    this.setState(
      {
        editID: todo.id,
        editContent: todo.content
      },
      () => {
        this.refs[`todo_${this.state.editID}`].focus();
      }
    );
  }
  //编辑todo
  updateTodo(e) {
    this.setState({
      editContent: e.target.value
    });
  }
  //esc取消编辑
  editCancel(e) {
    if (e.keyCode === 27) {
      this.setState({
        editID: -1
      });
    }
  }
  //保存todo,失去焦点和enter键时触发
  editSave(e) {
    e.preventDefault();
    let { todos, editID, editContent } = this.state;
    if (editContent.trim() == "") {
      //输入框为空时删除当前todo
      this.delTodo(editID);
      return;
    }
    todos.forEach(todo => {
      if (todo.id === editID) todo.content = editContent;
    });

    this.setState({
      editID: -1
    });
  }
  //编辑状态输入时更新状态

  //切换完成状态
  toggle(e, todo) {
    todo.isCompleted = !todo.isCompleted;
    this.computeRemain();
    this.setState({});
  }
  //选择所有
  choiceAll(e) {
    let { todos } = this.state;
    if (e.target.checked) {
      todos.forEach(todo => {
        todo.isCompleted = true;
      });
    } else {
      todos.forEach(todo => {
        todo.isCompleted = false;
      });
    }
    this.setState({});
    this.computeRemain();
  }

  renderList() {
    let { todos, editID, editContent, hash } = this.state;

    return todos.map((todo, index) => {
      if (todo.isCompleted && hash === "#/active") return null;
      if (!todo.isCompleted && hash === "#/completed") return null;
      return (
        <li
          className={
            (todo.isCompleted ? "completed" : "") +
            " " +
            (editID === todo.id ? "editing" : "")
          }
          key={todo.id}
        >
          <div className="view">
            <input
              className="toggle"
              type="checkbox"
              checked={todo.isCompleted}
              onChange={e => this.toggle(e, todo)}
            />
            <label onDoubleClick={e => this.editChoice(e, todo)}>
              {todo.content}
            </label>
            <button className="destroy" onClick={() => this.delTodo(todo.id)} />
          </div>
          <form onSubmit={e => this.editSave(e)}>
            <input
              ref={`todo_${todo.id}`}
              className="edit"
              value={editContent}
              onChange={e => this.updateTodo(e, todo)}
              onBlur={e => this.editSave(e)}
              onKeyDown={e => this.editCancel(e)}
            />
          </form>
        </li>
      );
    });
  }
  componentWillMount() {
    this.computeRemain();
    this.setState({
      hash: window.location.hash
    });
  }
  componentDidMount() {
    //当hash值改变时
    window.onhashchange = () => {
      this.setState({
        hash: window.location.hash
      });
    };
  }
  delTodo(id) {
    let arr = this.state.todos.filter(todo => {
      if (todo.id === id) {
        return false;
      } else {
        return true;
      }
    });
    this.setState(
      {
        todos: arr
      },
      () => {
        this.computeRemain();
      }
    );
  }
  clear() {
    let arr = this.state.todos.filter(todo => {
      if (!todo.isCompleted) {
        return true;
      } else {
        return false;
      }
    });
    this.computeRemain();
    this.setState(
      {
        todos: arr
      },
      () => {
        this.computeRemain();
      }
    );
  }
  render() {
    return (
      <React.Fragment>
        <section className="todoapp">
          <header className="header">
            <h1>todos</h1>
            <form onSubmit={e => this.submit(e)}>
              <input
                className="new-todo"
                placeholder="What needs to be done?"
                autoFocus
                onChange={e => this.inputHandler(e)}
                value={this.state.newTodo}
              />
            </form>
          </header>
          <section className="main">
            <input
              id="toggle-all"
              className="toggle-all"
              type="checkbox"
              checked={this.state.remain === 0}
              onChange={e => this.choiceAll(e)}
            />
            <label htmlFor="toggle-all">Mark all as complete</label>
            <ul className="todo-list">{this.renderList()}</ul>
          </section>

          <footer className="footer">
            <span className="todo-count">
              <strong>{this.state.remain}</strong> item left
            </span>
            <ul className="filters">
              <li>
                <a className="selected" href="#/">
                  All
                </a>
              </li>
              <li>
                <a href="#/active">Active</a>
              </li>
              <li>
                <a href="#/completed">Completed</a>
              </li>
            </ul>
            <button className="clear-completed" onClick={e => this.clear(e)}>
              Clear completed
            </button>
          </footer>
        </section>
        <footer className="info">
          <p>Double-click to edit a todo</p>
          <p>
            Template by <a href="http://sindresorhus.com">Sindre Sorhus</a>
          </p>
          <p>
            Created by <a href="http://todomvc.com">you</a>
          </p>
          <p>
            Part of <a href="http://todomvc.com">TodoMVC</a>
          </p>
        </footer>
      </React.Fragment>
    );
  }
}

export default App;
