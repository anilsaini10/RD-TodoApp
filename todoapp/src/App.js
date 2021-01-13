import React from 'react'
import './App.css';

class App extends React.Component {

  constructor(props){
    super(props);
    
    this.state={
      todoList: [],
      activeItem:{
        id:null,
        title:'',
        completed:false,
      },
      editing: false,
    }
    this.fetchTasks = this.fetchTasks.bind(this)
    this.handleChange= this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    // this.getCookie = this.getCookie.bind(this)
    this.startEdit = this.startEdit.bind(this)
    this.deleteItem = this.deleteItem.bind(this)


  };

  getCookie(name){
    var cookieValue = null
    if(document.cokkie && document.cookie !== ''){
      var cookies = document.cookie.split(';');
      for(var i=0; i<cookies.length(); i++){
        var cookie = cookies[i].trim();
        if(cookie.substring(0, name.length()+1)== (name +'=')){
          cookieValue = decodeURIComponent(cookie.substring(name.length()+1));
          break;
        }
      }
    }
    return cookieValue;
  }


  componentWillMount(){
    this.fetchTasks()
  }

  fetchTasks(){
    // console.log('Fetching...')
    fetch('/api/task-list/')
    .then(response => response.json())
    .then(data =>
      this.setState({
        todoList:data
      })
      )
  }

  handleChange(e){
    var name= e.target.name
    var value = e.target.value
    // console.log(name , value)
    this.setState({
      activeItem:{
        ...this.state.activeItem,
        title:value
      }
    })
  }

  handleSubmit(e){
    e.preventDefault()
    // console.log(this.state.activeItem)
    var url = '/api/task-create/'

    if(this.state.editing==true){
      url = `/api/task-update/${this.state.activeItem.id}/`
      this.setState({
        editing:false,
      })
    }
    var csrftoken = this.getCookie('csrftoken')

    fetch(url, {
      method: 'POST',
      headers:{
        'Content-type' : 'application/json',
        'X-CSRFToken': csrftoken,
      },
      body:JSON.stringify(this.state.activeItem)
    }).then(response =>{
      this.fetchTasks()
      this.setState({
        activeItem:{
          id:null,
          title:'',
          completed:false,
        }
      })

    }).catch(function(error){
      console.log("ERROR" , error)
    })
  }

  startEdit(task){
    console.log(task)
    this.setState({
      activeItem: task,
      editing: true,
    })
  }

  deleteItem(task){
    var csrftoken =this.getCookie('csrftoken')
    fetch(`/api/task-delete/${task.id}/`, {
      method:'DELETE',
      headers:{
        'Content-type':'application/json',
        'X-CSRFToken': csrftoken,
      },
    }).then(response =>{
      this.fetchTasks()
    })
  }

  render(){

    var tasks = this.state.todoList
    var self = this
    return (
      <div className="container">

        <div id="task-container">
          <div id="form-wrapper">  
            <form 
            onSubmit={this.handleSubmit} 
            id="form">
              <div className="flex-wrapper">
                <div style={{flex:6}}>
                  <input  onChange={this.handleChange}
                                   className="form-controller" 
                              id ="title"
                             type="text" 
                          placeholder = "new task"
                          value= {this.state.activeItem.title}>
                   </input>

                </div>
                <div style={{flex:1}}>
                  <input 
                  id="submit" 
                  className="btn btn-warning"
                  type="submit"
                  name="Add"
                  >

                  </input>
                </div>

              </div>

            </form>
          </div>
         
          <div id="list-wrapper">
            {tasks.map(function(task, index){
                return(
                  <div key={index} 
                  className="task-wrapper flex-wrapper">
                    <div style={{flex:7}}>
                  <span>{task.title}</span>
                    </div>

                    <div  style={{flex:1}}>
                      <button onClick={()=> self.startEdit(task)}
                      className="btn-edit"
                      >Edit
                      </button>
                      </div>

                      <div style={{flex:1}}>
                      <button
                      onClick={() => self.deleteItem(task)}
                      className="btn-edit"
                      
                      >Delete
                      </button>                  
                          </div>

                  </div>
                )
            }      
            )}
        
          </div>

        </div>

      </div>
    )
  }
}

export default App;
