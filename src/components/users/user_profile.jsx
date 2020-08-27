import React, { Component } from 'react';
import axios from 'axios';
import StatsList from "../profile/common/statsList";
import DoneChallenges from "../profile/common/doneChallenges";
import Loading from "../common/loading";
import Error from "../common/error";
import UsersList from "../common/usersList";

class UserProfile extends Component {
    constructor(props) {
        super(props);

        this.user = {};
        this.followings = [];
    }

    state = {
        id: null,
        username: window.location.search.split("=")[1], // get username by url; prototype - userprofile?username=volodia_choriy
        avatar: null,
        name: null,
        aboutMe: null,
        registerDate: null,
        instagram: null,

        followed: null,

        stats: null,

        screenWidth: null,
        screenHeight: null,

        dataRecived: false,

        edit: false,
        settings: false,
        error: null,

        users_list: null
    }

    componentDidMount() {
        if (localStorage.length === 0) window.location = "/login"; // if unauthorized redirect to /login
        else if (this.state.username === localStorage.username) window.location = "/profile" // if user username === current authorised user username redirect to /profile

        // resize listener
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);

        // set authorization header with JWT token
        axios.defaults.headers.common['Authorization'] = `${localStorage.token}`;

        // get user data by username
        axios.get(`${process.env.REACT_APP_API_URL}/user-profile?username=${this.state.username}`)
            .then(res => {
                // if this username doesn't exist redirect to /not-found
                if (res.data.length === 0) window.location = "/not-found";

                // user data
                let user = res.data[0];
                const { id, name, about_me, instagram, avatar, created_at } = user;

                // get followers for current user
                axios.get(`${process.env.REACT_APP_API_URL}/followers?id=${id}`)
                    .then(result => {
                        // check if this user followed by authorised user
                        const followed = result.data.find(el => parseInt(localStorage.id) === el.follower_id && user.id === el.user_id);
                        // get followers stats
                        const followers = this.getFollowersStats(result.data, id);

                        // get all records for user
                        axios.get(`${process.env.REACT_APP_API_URL}/records?id=${user.id}`)
                            .then(r => {
                                // update state with all recived data
                                this.setState({
                                    id,
                                    name,
                                    aboutMe: about_me,
                                    instagram,
                                    avatar,
                                    registerDate: this.formatDate(created_at),

                                    followersObject: followers,

                                    followers: followers.followersList ? followers.followersList.length : 0,
                                    following: followers.followingsList ? followers.followingsList.length : 0,
                                    friends: followers.friendsList ? followers.friendsList.length : 0,

                                    followed,

                                    stats: r.data,

                                    dataRecived: true
                                })
                            }).catch(error => this.setState({ error }));
                    }).catch(error => this.setState({ error }));
            }).catch(error => this.setState({ error }));
    }

    // get screen size
    componentWillUnmount = () => window.removeEventListener('resize', this.updateWindowDimensions);
    updateWindowDimensions = () => this.setState({ screenWidth: window.innerWidth, screenHeight: window.innerHeight });

    getFollowersStats = (list, userId) => {
        if (list.length === 0) return { followers: 0, followings: 0, friends: 0 }

        const followersList = list.filter(elem => elem.user_id === userId);
        const followingsList = list.filter(elem => elem.follower_id === userId);
        const friendsList = this.getFriends(followersList, followingsList);

        return { followersList, followingsList, friendsList }
    }

    getFriends = (followersList, followingsList) => {
        return followersList.filter(elem => {
            const id1 = elem.follower_id;
            const id2 = elem.user_id;

            let friend = false;
            followingsList.forEach(el => {
                const id3 = el.follower_id;
                const id4 = el.user_id;

                if (id1 === id4 && id2 === id3) friend = true;
            });
            return friend
        })
    }

    formatDate = date => {
        date = new Date(date);
        return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
    }

    handleFollow = () => {
        // set authorization header with JWT token
        axios.defaults.headers.common['Authorization'] = `${localStorage.token}`;

        // create connections to server => follow current user
        axios.post(`${process.env.REACT_APP_API_URL}/follow?${this.state.id}`)
            .then(result => { this.setState({ followingsList: this.getFollowersList() }) })
            .catch(error => this.setState({ error }));

        // create nofication --->
        // nofication values
        const values = {
            values: [this.state.id, `@${localStorage.username} started following you.`],
            forFollowers: false
        };

        // post values to `noficaitons` DB
        axios.post(`${process.env.REACT_APP_API_URL}/create-nofications`, values)
            .catch(error => this.setState({ error }));

        // TODO
        window.location.reload();
    }

    getUTC = date => new Date(date.getTime() + date.getTimezoneOffset() * 60000);

    handleUnFollow = () => {
        // set authorization header with JWT token
        axios.defaults.headers.common['Authorization'] = `${localStorage.token}`;

        // unfollow current user
        axios.delete(`${process.env.REACT_APP_API_URL}/unfollow?${this.state.id}`)
            .then(result => { this.setState({ followingsList: this.getFollowersList() }) })
            .catch(error => this.setState({ error }));

        // TODO
        window.location.reload();
    }

    redirectToInst = () => window.open("https://www.instagram.com/" + this.state.instagram, "_blank");

    handleClickOpen = list => {
        if (list === "followers") list = { list: this.state.followersObject.followersList, title: "Followers" };
        else if (list === "friends") list = { list: this.state.followersObject.friendsList, title: "Friends" };
        else if (list === "followings") list = { list: this.state.followersObject.followingsList, title: "Followings" };

        this.setState({ users_list: list });
    }

    handleClose = () => this.setState({ users_list: null });

    getStyles = smallScreen => {
        return {
            page: {
                display: smallScreen ? "" : "flex",
                paddingTop: "25px"
            },
            firstContainer: {
                main: {
                    width: smallScreen ? "100%" : "25%",
                    textAlign: "center",
                },
                username: {
                    float: "center",
                    textAlign: "center",
                    overflowWrap: "break-word"
                },
                avatar: {
                    width: "100%",
                    borderRadius: "3%"
                },
                followers: {
                    container: {
                        paddingTop: "7px",
                        display: "flex"
                    },
                    followers: {
                        textAlign: "center",
                        width: "33.35%",
                        cursor: "pointer",
                        overflowWrap: "break-word",
                    },
                    friends: {
                        textAlign: "center",
                        width: "33.35%",
                        cursor: "pointer",
                        overflowWrap: "break-word",
                    },
                    followings: {
                        textAlign: "center",
                        width: "33.35%",
                        cursor: "pointer",
                        overflowWrap: "break-word",
                    }
                },
                buttons: {
                    container: {
                        paddingTop: "25px"
                    },
                    settings: {
                        paddingTop: "15px"
                    }
                }
            },
            secondContainer: {
                main: {
                    width: smallScreen ? "100%" : "75%",
                    paddingLeft: smallScreen ? "0px" : "40px",
                    paddingTop: smallScreen ? "15px" : "0px"
                },
                instagram: {
                    cursor: "pointer",
                    display: this.state.instagram === null || this.state.instagram.length === 0 ? "none" : ""
                },
                aboutMe: {
                    container: {
                        paddingTop: "25px",
                        display: this.state.aboutMe === null || this.state.aboutMe.length === 0 ? "none" : ""
                    },
                    text: {
                        whiteSpace: "pre-line"
                    }
                },
                stats: {
                    container: {
                        paddingTop: "25px"
                    },
                    date: {
                        color: "gray",
                        fontSize: "17px",
                        fontWeight: "200px"
                    }
                }
            }
        }
    }

    render() {
        if (!this.state.dataRecived || !this.state.stats) return <Loading /> // if data !recived return loading spiner component
        else if (this.state.error) return <Error message={this.state.error.toString()} /> // handle error

        // get styles
        const smallScreen = this.state.screenWidth < 750;
        const styles = this.getStyles(smallScreen);

        return (
            <div>
                {/* dialog */}
                <UsersList
                    handleClose={this.handleClose}
                    list={this.state.users_list ? this.state.users_list.list : null}
                    title={this.state.users_list ? this.state.users_list.title : null}
                    screenWidth={this.state.screenWidth}
                />

                <div style={styles.page}>
                    {/* FIRST CONTAINER */}
                    <div style={styles.firstContainer.main}>
                        {/* username */}
                        <div style={styles.firstContainer.username}>
                            <h2>
                                @{this.state.username}
                            </h2>
                        </div>

                        {/* avatar */}
                        <div>
                            <img
                                src={this.state.avatar}
                                alt="Avatar"
                                style={styles.firstContainer.avatar}
                            />
                        </div>

                        {/* followers stats */}
                        <div style={styles.firstContainer.followers.container}>
                            <div style={styles.firstContainer.followers.followers} onClick={() => this.handleClickOpen("followers")}>
                                <h5>{this.state.followers}</h5>
                                <h6>Followers</h6>
                            </div>
                            <div style={styles.firstContainer.followers.friends} className="friends" onClick={() => this.handleClickOpen("friends")}>
                                <h5>{this.state.friends}</h5>
                                <h6>Friends</h6>
                            </div>
                            <div style={styles.firstContainer.followers.followings} onClick={() => this.handleClickOpen("followings")}>
                                <h5>{this.state.following}</h5>
                                <h6>Followings</h6>
                            </div>
                        </div>

                        {/* (un)follow and settings buttons */}
                        <div style={styles.firstContainer.buttons.container}>
                            {/* (un)follow button */}
                            <div>
                                {
                                    this.state.followed
                                        ? <button className="btn btn-outline-primary btn-block" onClick={() => this.handleUnFollow()}> Unfollow </button>
                                        : <button className="btn btn-primary btn-block" onClick={() => this.handleFollow()}> Follow </button>
                                }
                            </div>

                            {/* back button */}
                            <div style={styles.firstContainer.buttons.settings}>
                                <button onClick={() => window.history.go(-1)} className="btn btn-primary btn-block"> Back </button>
                            </div>
                        </div>
                    </div>


                    {/* SECOND CONTAINER */}
                    <div style={styles.secondContainer.main}>
                        {/* Name */}
                        <div>
                            <h1>
                                {this.state.name} <i // instagram
                                    style={styles.secondContainer.instagram}
                                    onClick={this.redirectToInst}
                                    className="fab fa-instagram"
                                ></i>
                            </h1>
                        </div>

                        {/* About Me */}
                        <div style={styles.secondContainer.aboutMe.container}>
                            <h4>About me:</h4>
                            <span style={styles.secondContainer.aboutMe.text}> {this.state.aboutMe} </span>
                        </div>

                        {/* Stats */}
                        <div style={styles.secondContainer.stats.container}>
                            {/* heading */}
                            <div>
                                <h4>Stats <span style={styles.secondContainer.stats.date}>(SINCE {this.state.registerDate})</span></h4>
                            </div>

                            {/* done exercizes */}
                            <div>
                                <StatsList id={this.state.id} />
                            </div>

                            {/* done challenges */}
                            <div>
                                <DoneChallenges id={this.state.id} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default UserProfile;