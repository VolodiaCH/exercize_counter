import React, { Component } from 'react';
import Dropdown from "./common/dropdown";
import axios from "axios";
import Error from "../../common/error";
import SnackBar from "../../common/snackbar";

class NewChallenge extends Component {
    state = {
        exersizeName: "",
        count: "",
        time: "",
        timeFormat: "Minutes",

        dropdownOpen: false,
        publish: false,

        error: null,

        snackbar: {
            message: "",
            status: "hide"
        },

        err: null
    }

    submit = () => {
        let time = this.state.time;
        if (this.state.timeFormat === "Hours") time = time * 60;
        else if (this.state.timeFormat === "Days") time = time * 60 * 24;

        const values = {
            creator_username: localStorage.username,
            challenge_name: this.state.challengeName,
            exercize_count: this.state.count,
            exercize_name: this.state.exersizeName,
            time: time,
            global: this.state.publish,
            creator_id: localStorage.id
        }

        if (!Object.values(values).every(el => el || el === false)) return this.setState({ error: "Please add all values." });
        else this.setState({ error: null });

        axios.defaults.headers.common['Authorization'] = `${localStorage.token}`;
        axios.post(`${process.env.REACT_APP_API_URL}/newChallenge`, values)
            .then(res => {
                const snackbar = {
                    message: `Started challenge "${values.challenge_name}".`,
                    status: "success"
                }

                this.setState({ snackbar });
                window.location.reload()
            })
            .catch(err => this.setState({ err }));

        if (this.state.publish) {
            const nofication_values = [localStorage.id, `@${localStorage.username} created new challenge "${this.state.challengeName}".`];
            axios.post(`${process.env.REACT_APP_API_URL}/create-nofications`, nofication_values);
        }
    }

    getUTC = date => new Date(date.getTime() + date.getTimezoneOffset() * 60000);

    getExersizeName = exersizeName => this.setState({ exersizeName });
    handleInputChange = event => this.setState({ count: event.target.value });
    handleTimeChange = event => this.setState({ time: event.target.value });
    handleChallengeNameChange = event => this.setState({ challengeName: event.target.value });
    handleCheckboxChange = () => this.setState({ publish: !this.state.publish });
    dropdown = () => this.setState({ dropdownOpen: !this.state.dropdownOpen });

    getStyles = smallScreen => {
        return {
            secondConteiner: {
                container: {
                    display: "flex",
                    justifyContent: "space-between",
                    paddingTop: "5px"
                },
                form: {
                    display: smallScreen ? "" : "flex",
                },
                dropdown: {
                    maxWidth: smallScreen ? "190px" : "210px",
                    paddingLeft: smallScreen ? "0px" : "15px",
                    paddingTop: smallScreen ? "10px" : "0px"
                },
                input: {
                    paddingLeft: smallScreen ? "0px" : "15px",
                    paddingTop: smallScreen ? "10px" : "0px",
                    width: smallScreen ? "190px" : "210px"
                },
                time: {
                    paddingLeft: smallScreen ? "0px" : "15px",
                    paddingTop: smallScreen ? "10px" : "0px",
                    maxWidth: smallScreen ? "190px" : "210px"
                },
                buttons: {
                    container: {
                        display: smallScreen ? "" : "flex",
                        float: "right"
                    },
                    button: {
                        paddingLeft: smallScreen ? "0px" : "10px",
                        paddingTop: smallScreen ? "10px" : "0px",
                    }
                }
            },
            alert: {
                display: this.state.error ? "" : "none",
                paddingTop: "15px"
            }
        }
    }

    render() {
        if (this.state.err) return <Error message={this.state.err.toString()} />

        const smallScreen = this.props.smallScreen;
        const styles = this.getStyles(smallScreen);

        return (
            <div>
                <SnackBar
                    message={this.state.snackbar.message}
                    status={this.state.snackbar.status}
                />

                <div style={styles.secondConteiner.container}>
                    <div style={styles.secondConteiner.form}>
                        <div>
                            <input
                                type="text"
                                placeholder="Challenge name"
                                className="form-control"

                                style={{ width: "200px" }}

                                value={this.state.challengeName}
                                onChange={this.handleChallengeNameChange}
                            />
                        </div>

                        <div style={styles.secondConteiner.dropdown}>
                            <Dropdown
                                list={this.props.list}
                                exersizeName={this.getExersizeName}
                                currentName={null}
                            />
                        </div>

                        <div style={styles.secondConteiner.input}>
                            <input
                                type="number"
                                placeholder="Count"
                                pattern='[0-9]'

                                className="form-control"

                                onChange={this.handleInputChange}
                                value={this.state.count}
                            />
                        </div>

                        <div style={styles.secondConteiner.time}>
                            <div className="input-group">
                                <input
                                    type="number"
                                    placeholder="Time"
                                    pattern='[0-9]'

                                    className="form-control"

                                    onChange={this.handleTimeChange}
                                    value={this.state.time}
                                />

                                <div className="input-group-append">
                                    <button
                                        className="btn btn-outline-secondary dropdown-toggle"
                                        type="button"
                                        data-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                        onClick={this.dropdown}
                                    >{this.state.timeFormat}</button>

                                    <div className={this.state.dropdownOpen ? "dropdown-menu show" : "dropdown-menu"}>
                                        <button onClick={() => this.setState({ timeFormat: "Minutes" })} className="dropdown-item">Minutes</button>
                                        <button onClick={() => this.setState({ timeFormat: "Hours" })} className="dropdown-item">Hours</button>
                                        <button onClick={() => this.setState({ timeFormat: "Days" })} className="dropdown-item">Days</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={styles.secondConteiner.buttons.container}>
                        <div>
                            <button className="btn btn-primary" onClick={() => this.submit(false)}> Start </button>
                            <div className="form-check">
                                <input
                                    className="form-check-input position-static"
                                    type="checkbox"
                                    id="blankCheckbox"
                                    value="option1"
                                    aria-label="..."

                                    onChange={this.handleCheckboxChange}
                                />
                                <span htmlFor="blankCheckbox" style={{ color: this.props.theme === "dark" ? "white" : "" }}>Publish</span>
                            </div>
                        </div>
                        <div style={styles.secondConteiner.buttons.button}>
                            <button className="btn btn-danger" onClick={() => window.location.reload()}> Cancel </button>
                        </div>
                    </div>
                </div>

                <div style={styles.alert}>
                    <div className="alert alert-danger" role="alert">
                        {this.state.error}
                    </div>
                </div>
            </div>
        );
    }
}

export default NewChallenge;