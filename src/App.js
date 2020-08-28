import React from 'react';
import { Component } from 'react';
import { Route, Redirect, Switch } from "react-router-dom";
import NavBar from "./components/navBar";
import RegisterForm from "./components/authorize/registerFrom";
import LoginForm from "./components/authorize/loginForm";
import Home from "./components/home/home";
import Profile from "./components/profile/profile";
import Users from "./components/users/users";
import NotFound from "../src/components/notFound";
import UserProfile from "./components/users/user_profile";
import Nofications from "./components/nofications/nofications";
import './App.css';

class App extends Component {
  state = {
    theme: "dark"
  }

  changeTheme = () => {
    if (this.state.theme === "dark") this.setState({ theme: "light" });
    else if (this.state.theme === "light") this.setState({ theme: "dark" });
  }

  render() {
    document.body.style.backgroundColor = this.state.theme === "dark" ? "#181A1B" : "white";

    return (
      <React.Fragment>
        <NavBar changeTheme={this.changeTheme} theme={this.state.theme} />

        <main className="container">
          <Switch>
            <Route path="/register" render={props => <RegisterForm {...props} theme={this.state.theme} />} />
            <Route path="/login" render={props => <LoginForm {...props} theme={this.state.theme} />} />
            <Route path="/home" render={props => <Home {...props} theme={this.state.theme} />} />
            <Route path="/profile" render={props => <Profile {...props} theme={this.state.theme} />} />
            <Route path="/userprofile" render={props => <UserProfile {...props} theme={this.state.theme} />} />
            <Route path="/users" render={props => <Users {...props} theme={this.state.theme} />} />
            <Route path="/nofications" render={props => <Nofications {...props} theme={this.state.theme} />} />
            <Route path="/not-found" render={props => <NotFound {...props} theme={this.state.theme} />} />
            <Redirect from="/" exact to="/home" />
            <Redirect to="/not-found" />
          </Switch>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
