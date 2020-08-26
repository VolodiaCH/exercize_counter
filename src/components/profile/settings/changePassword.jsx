import React, { Component } from 'react';
import axios from 'axios';
import Error from "../../common/error";

class ChangePassword extends Component {
    state = {
        oldPassword: "",
        password: "",
        confirmPassword: "",

        errors: {
            oldPassword: null,
            password: null,
            confirmPassword: null
        },

        error: null
    }

    handleOldPaswordChange = event => this.setState({ oldPassword: event.target.value });
    handlePasswordChange = event => this.setState({ password: event.target.value });
    handleConfirmPassword = event => this.setState({ confirmPassword: event.target.value });

    handleSubmit = () => {
        let errors = { oldPassword: null, password: null, confirmPassword: null };

        // check if errors
        if (!/^[a-zA-Z1-9]+$/.test(this.state.password)) errors.password = "Password must contain only letters and numbers.";
        if (this.state.oldPassword !== this.props.password) errors.oldPassword = "Wrong password.";
        if (this.state.oldPassword.length === 0) errors.oldPassword = "This field can't be empty.";
        if (this.state.password !== this.state.confirmPassword) errors.confirmPassword = "Passwords do not match.";
        if (this.state.password.length < 5) errors.password = "Password must contain 5 or more symbols";
        if (this.state.password.length === 0) errors.password = "This field can't be empty.";
        if (this.state.confirmPassword.length === 0) errors.confirmPassword = "This field can't be empty.";
        if (this.state.password.length > 64) errors.password = "Too long password! (64 - max)";

        this.setState({ errors });
        if (!Object.values(errors).every(el => el === null)) return false

        // set authorization header with JWT token
        axios.defaults.headers.common['Authorization'] = `${localStorage.token}`;

        // update `user` DB set new password for authorized user
        axios.put(`${process.env.REACT_APP_API_URL}/newPassword`, this.state.password)
            .then(res => window.location.reload())
            .catch(error => this.setState({ error }));
    }

    render() {
        // handle error
        if (this.state.error) return <Error message={this.state.error.toString()} />

        return (
            <div>
                <h3>Change password</h3>
                <div>
                    <input
                        type="password"
                        placeholder="Old Password"
                        aria-label="password"
                        id="oldPassword"

                        className={this.state.errors.oldPassword ? "form-control is-invalid" : "form-control"}
                        style={{ borderRadius: "3px" }}

                        onChange={this.handleOldPaswordChange}
                        value={this.state.oldPassword}
                    />

                    <div className="invalid-feedback" style={{ display: this.state.errors.oldPassword ? "" : "none" }}>
                        {this.state.errors.oldPassword}
                    </div>
                </div>

                <div style={{ paddingTop: "15px" }}>
                    <input
                        type="password"
                        placeholder="New Password"
                        aria-label="new-password"
                        id="newPassword"

                        className={this.state.errors.password ? "form-control is-invalid" : "form-control"}
                        style={{ borderRadius: "3px" }}

                        onChange={this.handlePasswordChange}
                        value={this.state.password}
                    />

                    <div className="invalid-feedback" style={{ display: this.state.errors.password ? "" : "none" }}>
                        {this.state.errors.password}
                    </div>
                </div>

                <div style={{ paddingTop: "15px" }}>
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        aria-label="confirm-new-password"
                        id="confirmNewPassword"

                        className={this.state.errors.confirmPassword ? "form-control is-invalid" : "form-control"}
                        style={{ borderRadius: "3px" }}

                        onChange={this.handleConfirmPassword}
                        value={this.state.confirmPassword}
                    />

                    <div className="invalid-feedback" style={{ display: this.state.errors.confirmPassword ? "" : "none" }}>
                        {this.state.errors.confirmPassword}
                    </div>
                </div>

                <br />

                <div>
                    <button onClick={this.handleSubmit} className="btn btn-primary">Change Password</button>
                </div>
            </div>
        );
    }
}

export default ChangePassword;