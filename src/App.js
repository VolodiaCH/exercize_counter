import React from 'react';
import { Component } from 'react';
import { Route, Redirect, Switch } from "react-router-dom";
import NavBar from "./components/navBar";
import RegisterForm from "./components/register_login/registerFrom";
import LoginForm from "./components/register_login/loginForm";
import Home from "./components/home/home";
import Profile from "./components/profile/profile";
import Users from "./components/users/users";
import NotFound from "../src/components/notFound";
import UserProfile from "./components/users/user_profile";
import Nofications from "./components/nofications/nofications";
import './App.css';

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <NavBar />
        <main className="container">
          <Switch>
            <Route path="/register" component={RegisterForm} />
            <Route path="/login" component={LoginForm} />
            <Route path="/home" component={Home} />
            <Route path="/profile" component={Profile} />
            <Route path="/userprofile" component={UserProfile} />
            <Route path="/users" component={Users} />
            <Route path="/nofications" component={Nofications} />
            <Route path="/not-found" component={NotFound} />
            <Redirect from="/" exact to="/home" />
            <Redirect to="/not-found" />
          </Switch>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
