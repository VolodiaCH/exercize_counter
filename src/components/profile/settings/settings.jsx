import React, { Component } from 'react';
import ChangeUsername from "./changeUsername";
import ChangePassword from "./changePassword";
import ResetData from "./resetData";
import DeleteProfile from "./deleteProfile";

class Settings extends Component {
    state = {
        user: this.props.userData,

        currentSetting: "Change username"
    }

    changeSettings = setting => this.setState({ currentSetting: setting });

    displayCurrentSetting = () => {
        const { currentSetting } = this.state;
        const password = this.state.user.password;
        const id = this.state.user.id;

        // display selected setting
        if (currentSetting === "Change username") return <ChangeUsername password={password} id={id} />
        else if (currentSetting === "Change password") return <ChangePassword password={password} id={id} />
        else if (currentSetting === "Reset data") return <ResetData password={password} id={id} />
        else if (currentSetting === "Delete profile") return <DeleteProfile password={password} id={id} />
        else return alert("404 Error! Setting not found.");
    }

    render() {
        const { smallScreen } = this.props;

        return (
            <div>
                <div style={{ paddingTop: "20px" }}>
                    <h1>Settings</h1>
                </div>

                <div style={{ display: "flex", height: "257px", paddingTop: smallScreen ? "50px" : "10px" }}>
                    <div className="btn-group-vertical">
                        <button
                            onClick={this.props.close}
                            type="button"
                            className="btn btn-primary"
                        >Back to profile</button>
                        <button
                            onClick={() => this.changeSettings("Change username")}
                            type="button"
                            className={this.state.currentSetting === "Change username" ? "btn btn-info" : "btn btn-outline-info"}
                        >Change username</button>

                        <button
                            onClick={() => this.changeSettings("Change password")}
                            type="button"
                            className={this.state.currentSetting === "Change password" ? "btn btn-info" : "btn btn-outline-info"}
                        >Change password</button>

                        <button
                            onClick={() => this.changeSettings("Reset data")}
                            type="button"
                            className={this.state.currentSetting === "Reset data" ? "btn btn-danger" : "btn btn-outline-danger"}
                        >Reset data</button>

                        <button
                            onClick={() => this.changeSettings("Delete profile")}
                            type="button"
                            className={this.state.currentSetting === "Delete profile" ? "btn btn-danger" : "btn btn-outline-danger"}
                        >Delete profile</button>
                    </div>

                    <div style={{ paddingLeft: smallScreen ? "15px" : "50px", width: "500px" }}>
                        {this.displayCurrentSetting()}
                    </div>
                </div>
            </div >
        );
    }
}

export default Settings;