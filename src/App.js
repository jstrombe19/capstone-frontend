import React, { Component } from 'react';
import './css/App.css';
import {BrowserRouter as Router, Route, Link, Switch, Redirect, withRouter} from 'react-router-dom';
import LoggedInHomePage from './Components/LoggedInHomePage';
import StartPage from './Components/StartPage';
import SignUpForm from './Components/SignUpForm';
import LogInForm from './Components/LogInForm'

const avatarURL = "http://localhost:3000/avatars"
const userURL = "http://localhost:3000/users"


class App extends Component {

  state = {
    loggedIn: false,
    avatars: [],
    users: [],
    loggedInUser: null,
    loggedInAvatar: null,
    mainAvatar: null
  }

 componentDidMount(){
   Promise.all([fetch(avatarURL), fetch(userURL)])
    .then(([res1, res2]) => {
      return Promise.all([res1.json(), res2.json()])
    })
    .then(([res1, res2]) => {
      this.setState({
        avatars: res1,
        users: res2
      })
    })
    .then(
      () =>{
        this.getMainAvatar()
      }
    )
 }

  addUser = (user) => {
    fetch(userURL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
      .then(() => this.setState({loggedInUser: user}))
      .then(() => {
        this.getLoggedInAvatar()
      })
  }

  getMainAvatar = () => {
    this.setState({mainAvatar: this.state.avatars.find(avatar => avatar.name === "pink hair")})
  }

  getLoggedInUser = (username) => {
    this.setState({loggedInUser: this.state.users.find(user => user.username === username)})
  }

  logIn = () => {
    this.setState({loggedIn: true})
  }

  getLoggedInAvatar = () => {
    if(this.state.loggedInUser){
      this.setState({loggedInAvatar: this.state.avatars.find(avatar => avatar.id === this.state.loggedInUser.avatar_id)})
    }
  }

  getLoggedInAll = (username) => {
    this.getLoggedInUser(username)
    this.getLoggedInAvatar()
  }

  


  render(){

    return (
      <Router>
       
        <div className="App">
          <Switch>
            <Route 
              path="/sign_up" 
              render={() => <SignUpForm 
                                avatars={this.state.avatars} 
                                addUser={this.addUser} 
                                logIn={this.logIn}
                            />
                      } 
            />
            <Route
              path='/login'
              render={() => <LogInForm getLoggedInAll={this.getLoggedInAll}/>}
              />
            <Route 
              path='/home'
              render={() => <LoggedInHomePage avatar={this.state.loggedInAvatar}/>}
            />
            <Route exact path="/"
              render={() => <StartPage avatar={this.state.mainAvatar}/>}
            />
          </Switch>
        </div>
      </Router>

      
    );
  }
}

export default App;
