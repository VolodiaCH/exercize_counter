import React, { Component } from 'react';
import axios from "axios";

class DoneChallenges extends Component {
    state = {
        challenges: null,
        my_challenges: null,

        rendered: false,

        currentIndex: 0
    }

    componentDidMount = () => {
        axios.defaults.headers.common['Authorization'] = `${localStorage.token}`;
        axios.get(`http://localhost:3000/api/getChallengers?id=${this.props.id}`)
            .then(res => {
                axios.get("http://localhost:3000/api/getChallenge")
                    .then(result => {
                        const done_challenges = res.data.filter(challenge => challenge.finished);
                        this.setState({
                            challenges: result.data,
                            my_challenges: done_challenges,
                            rendered: true,
                        });
                    })
                    .catch(error => this.setState({ error }));
            })
            .catch(error => this.setState({ error }));
    }

    changeIndex = event => this.setState({ currentIndex: event.target.value });

    render() {
        if (!this.state.rendered) {
            return (
                <div>
                    {/* <hr />
                    <LoadingComponent /> */}
                </div>
            )
        } else if (this.state.my_challenges.length === 0) return <div></div>

        const current_challenge = this.state.challenges.filter(challenge => challenge.challenge_id === this.state.my_challenges[this.state.currentIndex].challenge_id)[0];

        return (
            <div>
                {/* <hr /> */}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                        <h4>"{current_challenge.challenge_name}"</h4>
                        <span
                            className="text-muted"
                            style={{ cursor: "pointer" }}
                            onClick={() => window.location = localStorage.username === current_challenge.creator_username ? "/profile" : "/userprofile?username=" + current_challenge.creator_username}>
                            By: @{current_challenge.creator_username}
                            <span style={{ display: localStorage.username === current_challenge.creator_username ? "" : "none" }}> (me)</span>
                        </span>
                    </div>

                    {/* <div style={{ float: "right" }}>
                        <div>
                            <button type="button" className="btn btn-primary btn-sm">Start challenge</button>
                        </div>
                        <div style={{ paddingTop: "5px", float: "right" }}>
                            <button type="button" className="btn btn-primary btn-sm">See challenge</button>
                        </div>
                    </div> */}
                </div>
                <div style={{ paddingTop: "5px" }}>
                    <input
                        type="range"
                        className="custom-range"

                        style={{
                            display: this.state.my_challenges.length === 1 ? "none" : ""
                        }}

                        min="0"
                        max={this.state.my_challenges.length - 1}
                        step="1"

                        value={this.state.currentIndex}
                        onChange={this.changeIndex}
                    />
                </div>
                <hr />
            </div>
        )
    }
}

export default DoneChallenges;