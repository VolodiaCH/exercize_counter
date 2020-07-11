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
        axios.get("http://localhost:3000/api/getChallengers")
            .then(res => {
                // get challenges
                axios.get("http://localhost:3000/api/getChallenge")
                    .then(result => {
                        this.setState({
                            challenges: result.data,
                            my_challenges: res.data.filter(elem => elem.challenger_id === parseInt(localStorage.id)),
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
        axios.delete(`http://localhost:3000/api/dismiss-challenge?id=${id}`)
            .then(elem => window.location.reload())
    }

    handle_finish = (challenge_id, id) => {
        const challenge_req = this.state.challenges.filter(elem => elem.challenge_id === challenge_id)[0];

        axios.defaults.headers.common['Authorization'] = `${localStorage.token}`;
        axios.put(`http://localhost:3000/api/finish-challenge?id=${id}`)
            .then(res => {
                // create success snackbar
                const snackbar = {
                    message: "Challenge successfuly finished!",
                    status: "success"
                }
                this.setState({ snackbar });
            })
            .catch(error => this.setState({ error }));

        // create nofication --->
        // nofication values
        const nofication_values = {
            values: [localStorage.id, `@${localStorage.username} successfuly finished challenge "${challenge_req.challenge_name}".`],
            forFollowers: true
        };

        // post values to `nofications` DB
        axios.post(`http://localhost:3000/api/create-nofications`, nofication_values)
            .catch(error => this.setState({ error }));
    }

    render() {
        // if data !recived display loading 
        if (!this.state.rendered) return <LoadingComponent />
        // handle error
        else if (this.state.error) return <Error message={this.state.error.toString()} />
        // Don't display challenges if there all challenges is finished or if authorised user haven't done any challenges yet
        else if (this.state.my_challenges.every(challenge => challenge.finished) || this.state.my_challenges.length === 0) return <h4 style={{ color: "gray" }}> There are no challenges. </h4>

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
                        // Don't display if challenge finished
                        if (challenge.finished) return <div key={idx}></div>

                        // get current challenge 
                        const current_challenge = this.state.challenges.filter(elem => elem.challenge_id === challenge.challenge_id)[0];

                        // get challenge start/finish time
                        const start_time = new Date(challenge.start_time);
                        const finish_time = new Date(challenge.finish_time);

                        // get exercizes list that was done within start/finish time of challenge and with exercize name === challenge req exercize name 
                        const exercizes = this.state.exercizes_list.filter(el => {
                            const currentExercizeTime = new Date(el.exersize_time);
                            return currentExercizeTime >= start_time && currentExercizeTime <= finish_time && el.exersize_name === current_challenge.exercize_name
                        });

                        // get sum of filtered exercizes 
                        let sum = 0
                        exercizes.forEach(exercize => sum += exercize.exersize_count);

                        // get precentes of challenge progress
                        const precent = this.getPercent(sum, current_challenge.exercize_count).toString() + "%";

                        // if precentes >= 100% handle finish challenge
                        if (parseInt(precent) >= 100) this.handle_finish(challenge.challenge_id, challenge.id);

                        return (
                            <div key={idx}>
                                {/* paragraf (don't display if index === 0) */}
                                <div style={{ display: idx === 0 ? "none" : "" }}>
                                    <br />
                                </div>

                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <h4 className={100 <= parseInt(precent) ? "text-success" : ""}>
                                        {/* challenge name */}
                                        <span>"{current_challenge.challenge_name}"</span>

                                        {/* challenge progress in numbers (and dismiss icon) */}
                                        <span>
                                            ({sum} / {current_challenge.exercize_count})
                                            &nbsp;
                                                <i
                                                className="fas fa-times"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => this.handleDismiss(current_challenge, challenge.id)}
                                            ></i>
                                        </span>
                                    </h4>

                                    {/* display time left (00:00:00) */}
                                    <div style={{ float: "right" }}>
                                        <Timer endTime={finish_time} />
                                    </div>
                                </div>

                                {/* progress bar */}
                                <div className="progress">
                                    <div className="progress-bar progress-bar-striped progress-bar-animated"
                                        role="progressbar"
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                        style={{ width: precent }}
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