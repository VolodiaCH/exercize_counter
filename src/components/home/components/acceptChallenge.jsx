import React, { Component } from 'react';
import axios from "axios";
import Like from "./common/like";
import Loading from "../../common/loading";
import Error from "../../common/error";
import Sort from "../../common/sort";
import Paginate from "../../common/paginate";
import Alert from "../../common/alert";

class AcceptChallenge extends Component {
    state = {
        challenges: null,
        challengers: null,
        likes: null,

        menu: null,

        currentPage: 1,
        itemsOnPage: 7,

        rendered: false,
        error: null,

        alert: {
            title: "",
            message: "",

            challenge_id: null,

            show: false
        },

        sortReq: null
    }

    componentDidMount = () => this.getValues();

    getValues = () => {
        // set default authorization header with JWT token
        axios.defaults.headers.common['Authorization'] = `${localStorage.token}`;

        // get all challenges
        axios.get(`${process.env.REACT_APP_API_URL}/getChallenge`)
            .then(result => this.setState({ challenges: result.data.filter(elem => elem.global) }))
            .catch(error => this.setState({ error }));

        // get all likes (of challenges)
        axios.get(`${process.env.REACT_APP_API_URL}/get_likes`)
            .then(result => this.setState({ likes: result.data }))
            .catch(error => this.setState({ error }));

        // get all challengers
        axios.get(`${process.env.REACT_APP_API_URL}/getChallengers?id=${localStorage.id}`)
            .then(result => this.setState({ challengers: result.data }))
            .catch(error => this.setState({ error }));

        this.setState({ rendered: true });
    }

    handleLike = challenge => {
        axios.defaults.headers.common['Authorization'] = `${localStorage.token}`;

        axios.post(`${process.env.REACT_APP_API_URL}/like?id=${challenge.challenge_id}`)
            .catch(error => this.setState({ error }));

        this.getValues();
    }

    handleStart = challenge => {
        const alert = {
            title: `Start challenge "${challenge.challenge_name}"?`,
            message: `In this challenge you must do ${challenge.exercize_count} of ${challenge.exercize_name} in ${challenge.time_in_minutes} minutes.`,

            challenge_id: challenge.challenge_id,

            show: true
        }

        this.setState({ alert });
    }

    handleClose = () => this.setState({ alert: { title: "", message: "", show: false } });

    handleAccept = challenge_id => {
        const challenge_req = this.state.challenges.filter(elem => elem.challenge_id === challenge_id)[0];
        let start_time = new Date();
        let end_time = this.addMinutes(start_time, challenge_req.time_in_minutes);

        const values = [
            parseInt(localStorage.id),
            challenge_id,
            start_time,
            end_time,
            false
        ];

        axios.defaults.headers.common['Authorization'] = `${localStorage.token}`;
        axios.post(`${process.env.REACT_APP_API_URL}/accept-challenge`, values)
            .then(res => this.props.handleAcceptChallenge(challenge_req.challenge_name))
            .catch(error => this.setState({ error }));

        const nofication_values = {
            values: [localStorage.id, `@${localStorage.username} started challenge "${challenge_req.challenge_name}".`],
            forFollowers: true
        };
        axios.post(`${process.env.REACT_APP_API_URL}/create-nofications`, nofication_values)
            .catch(error => this.setState({ error }));
    }

    handleDelete = challenge_id => {
        axios.defaults.headers.common['Authorization'] = `${localStorage.token}`;
        axios.delete(`${process.env.REACT_APP_API_URL}/delete-challenge?id=${challenge_id}`)
            .then(() => window.location.reload())
            .catch(error => this.setState({ error }));
    }

    addMinutes = (date, minutes) => new Date(date.getTime() + minutes * 60000);

    sort = () => this.setState({ menu: this.state.menu === "sort" ? "" : "sort" });

    handleSort = values => this.setState({ sortReq: values });

    renderPage = list => {
        let page = [];
        const users_list = list;

        const currentPage = this.state.currentPage - 1;

        const startIndex = currentPage * this.state.itemsOnPage;
        const endIndex = startIndex + this.state.itemsOnPage;

        for (let index = startIndex; index < endIndex; index++) {
            if (users_list[index]) page.push(users_list[index]);
        }

        return page
    }

    changePage = page => this.setState({ currentPage: page });

    sortChallenges = (challenges, sort_req) => {
        if (sort_req.sortBy === "Only my") {
            const sorted_challenges = challenges.filter(elem => elem.creator_username === localStorage.username);

            if (sort_req.search !== "") {
                if (sort_req.searchBy === "Challenge name") {
                    return sorted_challenges.filter(elem => elem.challenge_name.toLowerCase().startsWith(sort_req.search.toLowerCase()));
                }
                else if (sort_req.searchBy === "Exercize name") {
                    return sorted_challenges.filter(elem => elem.exercize_name.toLowerCase().startsWith(sort_req.search.toLowerCase()));
                }
                else if (sort_req.searchBy === "Creator username") {
                    return sorted_challenges.filter(elem => elem.creator_username.toLowerCase().startsWith(sort_req.search.toLowerCase()));
                }
            }
            else return sorted_challenges
        }
        else if (sort_req.sortBy === "Old") {
            const sorted_challenges = challenges.reverse()

            if (sort_req.search !== "") {
                if (sort_req.searchBy === "Challenge name") {
                    return sorted_challenges.filter(elem => elem.challenge_name.toLowerCase().startsWith(sort_req.search.toLowerCase()));
                }
                else if (sort_req.searchBy === "Exercize name") {
                    return sorted_challenges.filter(elem => elem.exercize_name.toLowerCase().startsWith(sort_req.search.toLowerCase()));
                }
                else if (sort_req.searchBy === "Creator username") {
                    return sorted_challenges.filter(elem => elem.creator_username.toLowerCase().startsWith(sort_req.search.toLowerCase()));
                }
            }
            else return sorted_challenges
        }
        else if (sort_req.sortBy === "Most liked") {
            const sorted_challenges = challenges.sort((a, b) => {
                const a_id = a.challenge_id;
                const b_id = b.challenge_id;
                const a_likes = this.state.likes.filter(elem => elem.challenge_id === a_id).length;
                const b_likes = this.state.likes.filter(elem => elem.challenge_id === b_id).length;

                if (a_likes > b_likes) return -1
                else if (a_likes < b_likes) return 1
                else return 0
            })

            if (sort_req.search !== "") {
                if (sort_req.searchBy === "Challenge name") {
                    return sorted_challenges.filter(elem => elem.challenge_name.toLowerCase().startsWith(sort_req.search.toLowerCase()));
                }
                else if (sort_req.searchBy === "Exercize name") {
                    return sorted_challenges.filter(elem => elem.exercize_name.toLowerCase().startsWith(sort_req.search.toLowerCase()));
                }
                else if (sort_req.searchBy === "Creator username") {
                    return sorted_challenges.filter(elem => elem.creator_username.toLowerCase().startsWith(sort_req.search.toLowerCase()));
                }
            }
            else return sorted_challenges
        } else {
            if (sort_req.search !== "") {
                if (sort_req.searchBy === "Challenge name") {
                    return challenges.filter(elem => elem.challenge_name.toLowerCase().startsWith(sort_req.search.toLowerCase()));
                }
                else if (sort_req.searchBy === "Exercize name") {
                    return challenges.filter(elem => elem.exercize_name.toLowerCase().startsWith(sort_req.search.toLowerCase()));
                }
                else if (sort_req.searchBy === "Creator username") {
                    return challenges.filter(elem => elem.creator_username.toLowerCase().startsWith(sort_req.search.toLowerCase()));
                }
            } else return challenges
        }
    }

    getStyles = smallScreen => {
        return {
            main: {
                paddingTop: "20px"
            },
            heading: {
                container: {
                    display: "flex",
                    justifyContent: "space-between"
                },
                buttons: {
                    container: {
                        display: smallScreen ? "" : "flex"
                    },
                    button: {
                        paddingLeft: smallScreen ? "0px" : "10px",
                        paddingTop: smallScreen ? "10px" : "0px"
                    }
                }
            },
            menu: {
                main: {
                    display: this.state.menu === "sort" ? "" : "none"
                }
            },
            body: {
                container: {
                    paddingTop: "20px"
                },
                challenge: {
                    container: {
                        display: "flex",
                        justifyContent: "space-between"
                    },
                    username: {
                        cursor: "pointer"
                    },
                    nameContainer: {
                        container: {
                            display: "flex"
                        },
                        name: {
                            fontSize: "25px"

                        },
                        like: {
                            paddingTop: "6px",
                            paddingLeft: "10px",
                            fontSize: "20px"
                        }
                    },
                    buttons: {
                        container: {
                            display: smallScreen ? "" : "flex"
                        },
                        button: {
                            paddingLeft: smallScreen ? "0px" : "10px",
                            paddingTop: smallScreen ? "10px" : "0px"
                        }
                    }
                }
            }
        }
    }

    render() {
        if (!this.state.challenges || !this.state.likes) return <Loading />
        else if (this.state.error) return <Error message={this.state.error.toString()} />

        const sortBy = ["Only my", "Old", "Most liked"];
        const searchBy = ["Challenge name", "Exercize name", "Creator username"];

        let sortedChallenges;
        if (this.state.sortReq) sortedChallenges = this.sortChallenges(this.state.challenges, this.state.sortReq);
        else sortedChallenges = this.state.challenges;

        const page = this.renderPage(sortedChallenges);

        const smallScreen = this.props.smallScreen;
        const styles = this.getStyles(smallScreen);

        return (
            <div style={styles.main}>
                <Alert
                    message={this.state.alert.message}
                    title={this.state.alert.title}

                    challenge_id={this.state.alert.challenge_id}

                    show={this.state.alert.show}

                    handleAgree={this.handleAccept}
                    handleClose={this.handleClose}
                />

                {/* Heading */}
                <div style={styles.heading.container}>
                    <div>
                        <h3> Accept Challenge </h3>
                    </div>

                    <div style={styles.heading.buttons.container}>
                        <div>
                            <button className={this.state.menu === "sort" ? "btn btn-primary" : "btn btn-outline-primary"} onClick={this.sort}> Sort </button>
                        </div>
                        <div style={styles.heading.buttons.button}>
                            <button className="btn btn-danger" onClick={() => window.location.reload()}> Go back </button>
                        </div>
                    </div>
                </div>

                {/* Menu */}
                <div style={styles.menu.main}>
                    <hr />
                    <Sort sortBy={sortBy} searchBy={searchBy} handleSort={this.handleSort} smallScreen={smallScreen} />
                </div>

                {/* Body */}
                <div style={styles.body.container}>
                    {
                        page.map(challenge => {
                            const liked = this.state.likes.find(elem => elem.challenge_id === challenge.challenge_id && elem.user_id === parseInt(localStorage.id)) ? true : false;
                            const likes = this.state.likes.filter(elem => elem.challenge_id === challenge.challenge_id).length;

                            return (
                                <div key={challenge.challenge_id}>
                                    <hr />
                                    <div style={styles.body.challenge.container}>
                                        <div>
                                            <div style={styles.body.challenge.nameContainer.container}>
                                                <div>
                                                    <span style={styles.body.challenge.nameContainer.name}>
                                                        {challenge.challenge_name}
                                                    </span>
                                                </div>


                                                <span style={styles.body.challenge.nameContainer.like}>
                                                    <Like
                                                        handleLike={() => this.handleLike(challenge)}
                                                        active={liked}
                                                        likes={likes}
                                                    />
                                                </span>

                                            </div>

                                            <div>
                                                <span
                                                    className="text-muted"
                                                    style={styles.body.challenge.username}
                                                    onClick={() => window.location = localStorage.username === challenge.creator_username ? "/profile" : "/userprofile?username=" + challenge.creator_username}>
                                                    By @{challenge.creator_username}
                                                    <span style={{ display: localStorage.username === challenge.creator_username ? "" : "none" }}> (Me)</span>
                                                </span>
                                            </div>
                                        </div>

                                        <div style={styles.body.challenge.buttons.container}>
                                            <div style={{ display: localStorage.username === challenge.creator_username ? "" : "none" }}>
                                                <button onClick={() => this.handleDelete(challenge.challenge_id)} className="btn btn-danger">Delete</button>
                                            </div>
                                            <div style={styles.body.challenge.buttons.button}>
                                                <button onClick={() => this.handleStart(challenge)} className="btn btn-primary">Accept</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>

                <div style={{ paddingTop: "10px" }}>
                    <Paginate
                        list={sortedChallenges}
                        currentPage={this.state.currentPage}
                        changePage={this.changePage}
                        itemsOnPage={this.state.itemsOnPage}
                    />
                </div>
            </div>
        );
    }
}

export default AcceptChallenge;