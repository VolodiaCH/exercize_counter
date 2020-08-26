import React, { Component } from 'react';
import axios from 'axios';
import Error from "../../common/error";

class DeleteProfile extends Component {
    state = {
        password: "",
        checkBox: false,
        error: null,
        checkBoxError: false,

        err: null
    }

    checkBox = () => this.setState({ checkBox: !this.state.checkBox });
    handleInputChange = event => this.setState({ password: event.target.value });

    handleSubmit = () => {
        if (this.state.password.length === 0) return this.setState({ error: "This field cant be empty." });
        else if (this.state.password !== this.props.password) return this.setState({ error: "Wrong password." });
        else if (!this.state.checkBox) return this.setState({ checkBoxError: true });
        else this.setState({ error: null, checkBoxError: false });

        // set authorization header with JWT token
        axios.defaults.headers.common['Authorization'] = `${localStorage.token}`;

        // handle delete profile
        axios.delete(`${process.env.REACT_APP_API_URL}/deleteProfile?` + this.props.id)
            .then(res => {
                localStorage.clear();
                window.location = "/register";
            })
            .catch(err => this.setState({ err }));
    }

    render() {
        // handle error
        if (this.state.err) return <Error message={this.state.err.toString()} />;

        return (
            <div>
                <h3>Delete profile</h3>
                <div>
                    <input
                        style={{ borderRadius: "3px" }}
                        type="password"
                        className={this.state.error ? "form-control is-invalid" : "form-control"}
                        id="password"
                        placeholder="Password"

                        value={this.state.password}
                        onChange={this.handleInputChange}
                    />

                    <div className="invalid-feedback" style={{ display: this.state.error ? "" : "none" }}>
                        {this.state.error}
                    </div>
                </div>

                <div className="form-group form-check">
                    <input
                        type="checkbox"
                        className={this.state.checkBoxError ? "form-check-input is-invalid" : "form-check-input"}
                        id="exampleCheck1"

                        onChange={this.checkBox}
                    />
                    <label className="form-check-label" htmlFor="exampleCheck1">I know that I won't be able to restore it.</label>
                </div>

                <div>
                    <button onClick={this.handleSubmit} className="btn btn-danger">Delete profile</button>
                </div>
            </div>
        );
    }
}

export default DeleteProfile;