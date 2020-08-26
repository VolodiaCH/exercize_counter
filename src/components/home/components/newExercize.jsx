import React, { Component } from 'react';
import axios from "axios";
import Dropdown from "./common/dropdown";
import Error from "../../common/error";

class NewExercize extends Component {
    state = {
        exersizeName: "",
        count: "",
        inputValue: "",

        error: ""
    }

    createRecord = () => {
        if (localStorage.length === 0) window.location = "/login";

        let now = new Date();
        // now = this.addMinutes(now, now.getTimezoneOffset()); work
        console.log("now (NewExercize component):", now);

        let values = {
            exersizeName: this.state.exersizeName,
            times: this.state.count,
            time: now
        }

        if (values.exersizeName === "" && values.times === "") return this.setState({ error: "Please add values!" });
        else if (values.exersizeName === "") return this.setState({ error: "Exercize name can't be empty!" });
        else if (values.times === "") return this.setState({ error: "Please enter times you done exersize!" });
        else this.setState({ error: null });

        axios.defaults.headers.common['Authorization'] = `${localStorage.token}`;
        axios.post(`${process.env.REACT_APP_API_URL}/newRecord`, values)
            .then(res => {
                this.setState({ count: "" });
                this.props.createRecord({ ...values, id: res.data.insertId, user_id: parseInt(localStorage.id) })
            })
            .catch(err => this.setState({ err }));
    }

    getExersizeName = exersizeName => this.setState({ exersizeName });

    handleInputChange = event => {
        let { value, min, max } = event.target;
        value = Math.max(Number(min), Math.min(Number(max), Number(value)));

        if (value === 0) value = '';

        this.setState({ count: value, });
    }

    addMinutes = (date, minutes) => new Date(date.getTime() + minutes * 60000);

    getStyles = smallScreen => {
        return {
            alert: {
                display: this.state.error ? "" : "none"
            },
            buttons: {
                float: "right",
                paddingLeft: "5px",
                display: "flex",
                justifyContent: "space-between"
            },
            input: {
                width: "200px",
                paddingLeft: smallScreen ? "0px" : "15px",
                paddingTop: smallScreen ? "10px" : "0px"
            },
            values: {
                display: smallScreen ? "" : "flex",
                justifyContent: "space-between"
            },
            form: {
                display: "flex",
                justifyContent: "space-between"
            },
            cancel: {
                paddingLeft: "10px"
            }
        }
    }

    render() {
        if (this.state.err) return <Error message={this.state.err.toString()} />

        const smallScreen = this.props.smallScreen;
        const styles = this.getStyles(smallScreen);

        return (
            <div>
                <div style={styles.form}>
                    <div style={styles.values}>
                        <div>
                            <Dropdown
                                list={this.props.list}
                                exersizeName={this.getExersizeName}
                                currentName={null}
                            />
                        </div>

                        <div style={styles.input}>
                            <input
                                type="number"
                                placeholder="Count"
                                pattern='[0-9]'
                                min="0"
                                max="500"

                                className="form-control"

                                onChange={this.handleInputChange}
                                value={this.state.count}
                            />
                        </div>
                    </div>


                    <div style={styles.buttons}>
                        <div>
                            <button className="btn btn-primary" onClick={this.createRecord}> Save </button>
                        </div>
                        {/* <div style={styles.cancel}>
                            <button className="btn btn-danger" onClick={() => window.location.reload()}> Cancel </button>
                        </div> */}
                    </div>
                </div>

                <div style={styles.alert}>
                    <br />
                </div>

                <div style={styles.alert} className="alert alert-danger" role="alert">
                    {this.state.error}
                </div>
            </div>
        );
    }
}

export default NewExercize;