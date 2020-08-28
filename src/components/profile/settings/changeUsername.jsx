import React, { Component } from 'react';
import axios from 'axios';
import Error from "../../common/error";

class ChangeUsername extends Component {
    state = {
        newUsername: "",
        password: "",

        errors: {
            username: null,
            password: null
        },

        error: null
    }

    handleUsernameChange = event => this.setState({ newUsername: event.target.value });
    handlePasswordChange = event => this.setState({ password: event.target.value });

    handleSubmit = () => {
        let errors = { username: null, password: null };

        // check if errors
        if (!/^[a-zA-Z1-9_]+$/.test(this.state.newUsername)) errors.username = "Username must contain only letters, numbers or underlines.";
        if (this.state.password !== this.props.password) errors.password = "Wrong password.";
        if (this.state.newUsername.length === 0) errors.username = "This fileld can't be empty.";
        if (this.state.password.length === 0) errors.password = "This fileld can't be empty.";
        if (this.state.newUsername.length > 36) errors.username = "Too long username! (36 - max)";

        this.setState({ errors });
        if (!Object.values(errors).every(el => el === null)) return false

        // set authorization header with JWT token
        axios.defaults.headers.common['Authorization'] = `${localStorage.token}`;

        // update `user` DB set new username
        axios.put(`${process.env.REACT_APP_API_URL}/newUsername`, this.state.newUsername)
            .then(res => {
                // check if this username already taken (if true - create error)
                if (res.data === "This username is already taken.") {
                    errors.username = res.data;
                    return this.setState({ errors });
                }

                // writing new token, id, username to localStorage
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("id", res.data.userData.id.toString());
                localStorage.setItem("username", res.data.userData.username);

                window.location.reload();
            })
            .catch(error => this.setState({ error }));
    }

    render() {
        // check if error
        if (this.state.error) return <Error message={this.state.error.toString()} />

        return (
            <div>
                <h3 style={{ color: this.props.theme === "dark" ? "white" : "" }}>Change username</h3>

                <div>
                    <input
                        type="text"
                        style={{ borderRadius: "3px" }}
                        className={this.state.errors.username ? "form-control is-invalid" : "form-control"}
                        placeholder="New username"
                        aria-label="username"
                        id="new-username"

                        value={this.state.newUsername}
                        onChange={this.handleUsernameChange}
                    />

                    <div className="invalid-feedback" style={{ display: this.state.errors.username ? "" : "none" }}>
                        {this.state.errors.username}
                    </div>
                </div>

                <div style={{ paddingTop: "15px" }}>
                    <input
                        type="password"
                        style={{ borderRadius: "3px" }}
                        className={this.state.errors.password ? "form-control is-invalid" : "form-control"}
                        placeholder="Password"
                        aria-label="password"
                        id="password"

                        value={this.state.password}
                        onChange={this.handlePasswordChange}
                    />

                    <div className="invalid-feedback" style={{ display: this.state.errors.password ? "" : "none" }}>
                        {this.state.errors.password}
                    </div>
                </div>

                <br />

                <div>
                    <button onClick={this.handleSubmit} className="btn btn-primary">Change Username</button>
                </div>
            </div>
        );
    }
}

export default ChangeUsername;