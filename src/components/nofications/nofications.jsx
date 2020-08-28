import React, { Component } from 'react';
import axios from "axios";
import Loading from "../common/loading";
import Error from "../common/error";
import Paginate from "../common/paginate";

class Nofications extends Component {
    state = {
        nofications: null,
        followersList: null,

        screenWidth: null,
        screenHeight: null,

        currentPage: 1,
        itemsOnPage: 10,

        error: null
    }

    componentDidMount = () => {
        // screen resize listener
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);

        this.getNofications();
    }

    getNofications = () => {
        // connection to server => get all nofications for current user
        axios.defaults.headers.common['Authorization'] = `${localStorage.token}`;

        // get all nofications
        axios.get(`${process.env.REACT_APP_API_URL}/get-nofications`)
            .then(result => this.setState({ nofications: result.data.reverse() }))
            .catch(error => this.setState({ error }));
    }

    // get screen size
    componentWillUnmount = () => window.removeEventListener('resize', this.updateWindowDimensions);
    updateWindowDimensions = () => this.setState({ screenWidth: window.innerWidth, screenHeight: window.innerHeight });

    checkAsSeen = nofication_id => {
        // set authorization header with JWT token
        axios.defaults.headers.common['Authorization'] = `${localStorage.token}`;

        // check nofication as seen
        axios.put(`${process.env.REACT_APP_API_URL}/check-nofication-as-seen?id=${nofication_id}`)
            .then(result => {
                // create new nofications list with checked nofication as seen
                const nofications = this.state.nofications.map(nofication => {
                    let new_nofication = { ...nofication };
                    new_nofication.seen = true;

                    return nofication.id === nofication_id ? new_nofication : nofication
                });

                // get count of unseen nofications
                const unseenNofications = nofications.filter(nofication => !nofication.seen).length;

                // if unseen nofications = 0 reload window
                if (unseenNofications === 0) return window.location.reload();

                this.setState({ nofications });
            }).catch(error => this.setState({ error }));
    }

    handleDelete = nofication_id => {
        // set authorization header with JWT token
        axios.defaults.headers.common['Authorization'] = `${localStorage.token}`;

        // delete nofication from `nofications` DB
        axios.delete(`${process.env.REACT_APP_API_URL}/delete-nofication?id=${nofication_id}`)
            .then(result => {
                const nofications = this.state.nofications.filter(nofication => nofication.id !== nofication_id);

                // if nofications = 0 reload window
                if (nofications.length === 0) return window.location.reload();

                this.setState({ nofications });
            }).catch(error => this.setState({ error }));
    }

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

    checkAllAsSeen = () => {
        // set authorization header with JWT token
        axios.defaults.headers.common['Authorization'] = `${localStorage.token}`;

        // set all nofications as seen for current_user
        axios.put(`${process.env.REACT_APP_API_URL}/check-all-nofications-as-seen`)
            .then(res => window.location.reload())
            .catch(error => this.setState({ error }));
    }

    deleteAll = () => {
        // set authorization header with JWT token
        axios.defaults.headers.common['Authorization'] = `${localStorage.token}`;

        // delete all nofications for current_user
        axios.delete(`${process.env.REACT_APP_API_URL}/delete-all-nofications`)
            .then(res => window.location.reload())
            .catch(error => this.setState({ error }));
    }

    getStyles = (smallScreen, unseenNofications) => {
        return {
            mainConainer: {
                paddingTop: "25px"
            },
            heading: {
                container: {
                    display: smallScreen ? "" : "flex",
                    justifyContent: "space-between"
                },
                buttons: {
                    container: {
                        display: "flex",
                        paddingTop: smallScreen ? "10px" : "0px"
                    },
                    button: {
                        paddingLeft: "10px"
                    }
                }
            },
            unseenNofications: {
                display: unseenNofications === 0 ? "none" : ""
            },
            noNoficationsLabel: {
                color: "gray"
            },
            nofication: {
                container: {
                    display: "flex",
                    justifyContent: "space-between"
                },
                message: {
                    container: {
                        display: smallScreen ? "" : "flex"
                    },
                    username: {
                        cursor: "pointer",
                        color: "#FF6666",
                        fontSize: "20px"
                    },
                    text: {
                        fontSize: "20px",
                        color: this.props.theme === "dark" ? "white" : ""
                    }
                },
                buttons: {
                    container: {
                        float: "right",
                        display: "flex"
                    },
                    delete: {
                        container: {
                            paddingLeft: "10px"
                        },
                        button: {
                            cursor: "pointer"
                        }
                    }
                }
            },
            paginate: {
                paddingTop: "25px"
            }
        }
    }

    render() {
        if (!this.state.nofications) return <Loading />
        else if (this.state.error) return <Error message={this.state.error.toString()} />

        // get count of unseen nofications
        const unseenNofications = this.state.nofications.filter(nofication => !nofication.seen).length;

        // styles
        const smallScreen = this.state.screenWidth < 500;
        const styles = this.getStyles(smallScreen, unseenNofications);

        // nofications list to render
        const page = this.renderPage(this.state.nofications);

        const whiteHr = { height: "1px", backgroundColor: "gray", border: "none" };
        const hrStyle = this.props.theme === "dark" ? whiteHr : {};

        return (
            <div style={styles.mainConainer}>
                <div style={styles.heading.container}>
                    <div>
                        <h2 onClick={this.getNofications} style={{ cursor: "pointer", color: this.props.theme === "dark" ? "gray" : "" }}>
                            Notifications <span style={styles.unseenNofications}>({unseenNofications})</span>
                        </h2>
                    </div>

                    <div style={styles.heading.buttons.container}>
                        <div>
                            <button className="btn btn-primary" onClick={this.checkAllAsSeen} disabled={this.state.nofications.length === 0 || unseenNofications === 0}>
                                Check all notifications as seen
                            </button>
                        </div>

                        <div style={styles.heading.buttons.button}>
                            <button className="btn btn-primary" onClick={this.deleteAll} disabled={this.state.nofications.length === 0}>
                                Delete all notifications
                            </button>
                        </div>
                    </div>
                </div>
                <hr style={hrStyle} />
                <div>
                    {
                        this.state.nofications.length === 0
                            ? <div>
                                <h4 style={styles.noNoficationsLabel}>
                                    You have not any notifications.
                                </h4>
                            </div>
                            : page.map(nofication => {
                                // styles
                                const s = {
                                    message: {
                                        paddingLeft: nofication.seen ? "0px" : smallScreen ? "0px" : "10px"
                                    },
                                    new: {
                                        display: nofication.seen ? "none" : ""
                                    }
                                }

                                // get array of words from message
                                const message_words = nofication.message.split(" ");

                                // get first word (username)
                                let username = message_words[0].substring();

                                // if first word isn't username - delete it 
                                if (!username.startsWith("@")) username = "";

                                // creating message without @username
                                let message = "";
                                for (let word = 0; word < message_words.length; word++) {
                                    if (!message_words[word].startsWith("@")) {
                                        message += " " + message_words[word];
                                    }
                                }

                                return (
                                    <div key={nofication.id}>
                                        <div style={styles.nofication.container}>
                                            <div style={styles.nofication.message.container}>
                                                <div style={s.new}>
                                                    <span style={{ fontSize: "20px", color: this.props.theme === "dark" ? "white" : "" }}>New!</span>
                                                </div>

                                                <div style={s.message}>
                                                    <div>
                                                        <span
                                                            style={styles.nofication.message.username}
                                                            onClick={() => window.location = "/userprofile?username=" + username.substring(1)}
                                                        > {username} </span>
                                                        <span style={styles.nofication.message.text}> {message}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={styles.nofication.buttons.container}>
                                                {
                                                    nofication.seen
                                                        ? <div></div>
                                                        : <div>
                                                            <button
                                                                type="button"
                                                                className="btn btn-primary btn-sm"

                                                                onClick={() => this.checkAsSeen(nofication.id)}
                                                            > Seen </button>
                                                        </div>
                                                }

                                                <div style={styles.nofication.buttons.delete.container}>
                                                    <h5 style={{ color: this.props.theme === "dark" ? "white" : "" }}>
                                                        <i className="fas fa-trash-alt"
                                                            style={styles.nofication.buttons.delete.button}

                                                            onClick={() => this.handleDelete(nofication.id)}
                                                        ></i>
                                                    </h5>
                                                </div>
                                            </div>
                                        </div>

                                        <hr style={hrStyle} />
                                    </div>
                                )
                            })
                    }
                </div>

                <div style={styles.paginate}>
                    <Paginate list={this.state.nofications}
                        currentPage={this.state.currentPage}
                        changePage={this.changePage}
                        itemsOnPage={this.state.itemsOnPage} />
                </div>
            </div>
        );
    }
}

export default Nofications;