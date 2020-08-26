import React, { Component } from 'react';
import axios from "axios";
import Dropdown from "./common/dropdown";
import Error from "../../common/error";

class EditExercize extends Component {
    state = {
        exersizeName: "",
        count: this.props.exercize.exersize_count,
        error: "",

        err: null
    }

    editRecord = () => {
        if (localStorage.length === 0) window.location = "/login";

        const now = new Date();
        let values = {
            exersizeName: this.state.exersizeName,
            times: this.state.count,
            time: now,
            id: this.props.exercize.exersize_id
        }

        if (values.exersizeName === "" && values.times === "") return this.setState({ error: "Please add values!" });
        else if (values.exersizeName === "") return this.setState({ error: "Exercize name can't be empty!" });
        else if (values.times === "") return this.setState({ error: "Please enter times you done exersize!" });
        else this.setState({ error: null });

        axios.defaults.headers.common['Authorization'] = `${localStorage.token}`;
        axios.put(`${process.env.REACT_APP_API_URL}/updateRecord`, values)
            .then(res => {
                window.location.reload();
            })
            .catch(err => this.setState({ err }));
    }

    getExersizeName = exersizeName => this.setState({ exersizeName });

    handleInputChange = event => {
        let { value, min, max } = event.target;
        value = Math.max(Number(min), Math.min(Number(max), Number(value)));

        if (value === 0) value = '';

        this.setState({ count: value });
    }

    render() {
        if (this.state.err) return <Error message={this.state.err.toString()} />

        const smallScreen = this.props.smallScreen;
        const styles = {
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
                paddingLeft: smallScreen ? "0px" : "10px",
                paddingTop: smallScreen ? "10px" : "0px"
            }
        }

        return (
            <div>
                <div>
                    <h3>Edit exercize</h3>
                </div>
                <div style={styles.form}>
                    <div style={styles.values}>
                        <div>
                            <Dropdown
                                list={this.props.list}
                                exersizeName={this.getExersizeName}
                                currentName={this.props.exercize.exersize_name}
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
                            <button className="btn btn-primary" onClick={this.editRecord}> Save </button>
                        </div>
                        <div style={styles.cancel}>
                            <button className="btn btn-danger" onClick={() => window.location.reload()}> Cancel </button>
                        </div>
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

export default EditExercize;