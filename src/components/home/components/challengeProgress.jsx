import React, { Component } from 'react';
import axios from "axios";
import LoadingComponent from "../../common/loadingComponent";
import Error from "../../common/error";
import Timer from "./common/timer";
import Alert from '../../common/alert';
import SnackBar from "../../common/snackbar";

class ChallengeProgress extends Component {
    state = {
        challenges: null,
        exercizes_list: this.props.list,
        my_challenges: null,

        alert: {
            title: "",
            message: "",

            challenge_id: null,

            show: false
        },

        snackbar: {
            message: "",
            status: "hide"
        },

        rendered: false,
        error: null
    }

    componentDidMount = () => {
        // set authorization header with JWT token
        axios.defaults.headers.common['Authorization'] = `${localStorage.token}`;

        // get challengers
        axios.get(`${process.env.REACT_APP_API_URL}/getChallengers`)
            .then(res => {
                // get challenges
                axios.get(`${process.env.REACT_APP_API_URL}/getChallenge`)
                    .then(result => {
                        this.setState({
                            challenges: result.data,
                            my_challenges: res.data.filter(challenge => challenge.challenger_id === parseInt(localStorage.id) && !challenge.hiden),
                            rendered: true
                        });
                    })
                    .catch(error => this.setState({ error }));
            })
            .catch(error => this.setState({ error }));
    }

    handleClose = () => this.setState({ alert: { title: "", message: "", show: false } });

    getPercent = (now, need) => now * 100 / need;
    addMinutes = (date, minutes) => new Date(date.getTime() + minutes * 60000);

    handleDismiss = (challenge, challenge_id) => {
        // create alert
        const alert = {
            title: `Dismiss challenge "${challenge.challenge_name}"?`,
            // message: `In this challenge you must do ${challenge.exercize_count} of ${challenge.exercize_name} in ${challenge.time_in_minutes} minutes.`,
            message: null,

            challenge_id,

            show: true
        }

        this.setState({ alert });
    }

    dismiss = id => {
        axios.defaults.headers.common['Authorization'] = `${localStorage.token}`;
        axios.delete(`${process.env.REACT_APP_API_URL}/dismiss-challenge?id=${id}`)
            .then(res => window.location.reload())
    }

    handleHide = id => {
        axios.defaults.headers.common['Authorization'] = `${localStorage.token}`;
        axios.put(`${process.env.REACT_APP_API_URL}/hide-challenge?id=${id}`)
            .then(res => {
                let { my_challenges } = this.state;
                my_challenges.filter(challenge => challenge.id === id);

                // create success snackbar
                const snackbar = {
                    message: "Challenge hided.",
                    status: "success"
                }

                this.setState({ my_challenges, snackbar });
                window.location.reload();
            }).catch(err => this.setState({ err }));
    }

    handle_finish = (challenge_id, id) => {
        const challenge_req = this.state.challenges.filter(elem => elem.challenge_id === challenge_id)[0];

        axios.defaults.headers.common['Authorization'] = `${localStorage.token}`;
        axios.put(`${process.env.REACT_APP_API_URL}/finish-challenge?id=${id}`)
            .then(res => {
                let { my_challenges } = this.state;
                my_challenges.map(challenge => {
                    if (challenge.id === challenge_id) {
                        challenge.finished = true;
                    }

                    return challenge
                })

                // create success snackbar
                const snackbar = {
                    message: "Challenge successfuly finished!",
                    status: "success"
                }
                this.setState({ snackbar, my_challenges });
                window.location.reload();
            })
            .catch(error => this.setState({ error }));

        // create nofication --->
        // nofication values
        const nofication_values = {
            values: [localStorage.id, `@${localStorage.username} successfuly finished challenge "${challenge_req.challenge_name}".`],
            forFollowers: true
        };

        // post values to `nofications` DB
        axios.post(`${process.env.REACT_APP_API_URL}/create-nofications`, nofication_values)
            .catch(error => this.setState({ error }));
    }

    render() {
        // if data !recived display loading 
        if (!this.state.rendered) return <LoadingComponent />
        // handle error
        else if (this.state.error) return <Error message={this.state.error.toString()} />
        // Don't display challenges if there all challenges is finished or if authorised user haven't done any challenges yet
        else if (this.state.my_challenges.length === 0 || this.state.my_challenges.every(challenge => challenge.hiden)) return <h4 style={{ color: "gray" }}> There are no challenges. </h4>

        return (
            <div>
                <SnackBar
                    message={this.state.snackbar.message}
                    status={this.state.snackbar.status}
                />

                <Alert
                    message={this.state.alert.message}
                    title={this.state.alert.title}

                    challenge_id={this.state.alert.challenge_id}

                    show={this.state.alert.show}

                    handleAgree={this.dismiss}
                    handleClose={this.handleClose}
                />

                {
                    this.state.my_challenges.map((challenge, idx) => {
                        // get current challenge 
                        const current_challenge = this.state.challenges.filter(elem => elem.challenge_id === challenge.challenge_id)[0];

                        // get challenge start/finish time
                        const start_time = new Date(challenge.start_time);
                        const finish_time = new Date(challenge.finish_time);
                        const current_time = this.addMinutes(new Date(), new Date().getTimezoneOffset());

                        // get exercizes list that was done within start/finish time of challenge and with exercize name === challenge req exercize name 
                        const exercizes = this.state.exercizes_list.filter(el => {
                            const currentExercizeTime = new Date(el.exersize_time);
                            // console.log(currentExercizeTime, start_time, finish_time);
                            return currentExercizeTime >= start_time && currentExercizeTime <= finish_time && el.exersize_name.toLowerCase() === current_challenge.exercize_name.toLowerCase()
                        });

                        // get sum of filtered exercizes 
                        let sum = 0
                        exercizes.forEach(exercize => sum += exercize.exersize_count);

                        // get precentes of challenge progress
                        const precent = this.getPercent(sum, current_challenge.exercize_count).toString() + "%";
                        console.log("precent:", precent);

                        // if precentes >= 100% handle finish challenge
                        if (parseInt(precent) >= 100 && challenge.finished === 0) this.handle_finish(challenge.challenge_id, challenge.id);

                        return (
                            <div key={idx}>
                                {/* br (don't display if index === 0) */}
                                <div style={{ display: idx === 0 ? "none" : "" }}>
                                    <br />
                                </div>

                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <h4>

                                        <span style={{ display: "flex" }}>
                                            <div>
                                                {/* challenge name */}
                                                <span className={100 <= parseInt(precent) || challenge.finished ? "text-success" : ""} style={{ color: this.props.theme === "dark" ? "white" : "" }}>"{current_challenge.challenge_name}"</span>
                                                &nbsp;

                                                {/* challenge progress in numbers */}
                                                <span style={{ display: 100 <= parseInt(precent) || challenge.finished ? "none" : "", color: this.props.theme === "dark" ? "white" : "black" }}>
                                                    ({sum} / {current_challenge.exercize_count})
                                                </span>
                                            </div>

                                            {/* dismiss */}
                                            <div style={{ paddingLeft: "10px" }}>
                                                <i
                                                    className="fas fa-times"
                                                    style={{ cursor: "pointer", color: this.props.theme === "dark" ? "gray" : "black" }}
                                                    onClick={() => this.handleDismiss(current_challenge, challenge.id)}
                                                ></i>
                                            </div>

                                            <div style={{ paddingLeft: "10px", display: finish_time >= current_time || 100 <= parseInt(precent) || challenge.finished ? "" : "none" }}>
                                                <button className="btn btn-primary btn-sm" onClick={() => this.handleHide(challenge.id)}>
                                                    Hide
                                                </button>
                                            </div>
                                        </span>
                                    </h4>

                                    {/* display time left (00:00:00) */}
                                    <div style={{ float: "right" }}>
                                        <Timer theme={this.props.theme} endTime={finish_time} />
                                    </div>
                                </div>

                                {/* progress bar */}
                                <div className="progress" style={{ backgroundColor: this.props.theme === "dark" ? "gray" : "" }}>
                                    <div className="progress-bar progress-bar-striped progress-bar-animated"
                                        role="progressbar"
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                        style={{ width: challenge.finished ? "100%" : precent }}
                                    ></div>
                                </div>
                            </div>
                        )
                    })
                }
            </div >
        );
    }
}

export default ChallengeProgress;