import React, { Component } from 'react';
import axios from 'axios';
import StatsList from "./common/statsList";
import EditProfile from "./editMyProfile";
import Loading from "../common/loading";
import LoadingComponent from "../common/loadingComponent";
import Settings from "./settings/settings";
import Error from "../common/error";
import UsersList from "../common/usersList";
import DoneChallenges from "./common/doneChallenges";

class Profile extends Component {
	state = {
		user: {},

		avatar: null,
		username: null,
		name: null,
		aboutMe: null,
		registerDate: null,
		instagram: null,

		stats: [],

		screenWidth: null,
		screenHeight: null,

		dataRecived: false,

		edit: false,
		settings: false,

		error: null
	}

	async componentDidMount() {
		// redirect to login if unauthorised
		if (localStorage.length === 0) window.location = "/login";

		// window resize listener
		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions);

		let user;
		let followings;

		// set authorization header with JWT token
		axios.defaults.headers.common['Authorization'] = `${localStorage.token}`;

		// get profile data
		await axios.get(`${process.env.REACT_APP_API_URL}/myProfile`)
			.then(res => user = res.data)
			.catch(error => this.setState({ error }));

		// get followers
		await axios.get(`${process.env.REACT_APP_API_URL}/followers`)
			.then(res => followings = res.data)
			.catch(error => this.setState({ error }));

		// if data recived
		if (user && followings) {
			// followers stats returns object { followers, followings, friends }
			const followers = this.getFollowersStats(followings, user.id);

			this.setState({
				user,

				username: "@" + user.username,
				name: user.name,
				instagram: user.instagram,
				aboutMe: user.about_me,
				registerDate: this.formatDate(user.created_at),
				avatar: user.avatar,

				followersObject: followers,

				followers: followers.followersList ? followers.followersList.length : 0,
				following: followers.followingsList ? followers.followingsList.length : 0,
				friends: followers.friendsList ? followers.friendsList.length : 0,

				dataRecived: true
			});
		}
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

	formatDate = date => {
		date = new Date(date);
		return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
	}

	getFriends = (followersList, followingsList) => {
		return followersList.filter(elem => {
			const id1 = elem.follower_id;
			const id2 = elem.user_id;

			let is_friend = false;
			followingsList.forEach(el => {
				const id3 = el.follower_id;
				const id4 = el.user_id;

				if (id1 === id4 && id2 === id3) is_friend = true;
			});

			return is_friend
		})
	}

	redirectToInst = () => window.open("https://www.instagram.com/" + this.state.instagram, "_blank");

	edit = () => this.setState({ edit: true });
	settings = () => this.setState({ settings: true });

	handleClose = () => this.setState({ users_list: null });

	handleClickOpen = users_list => {
		if (users_list === "followers") users_list = { list: this.state.followersObject.followersList, title: "Followers" };
		else if (users_list === "friends") users_list = { list: this.state.followersObject.friendsList, title: "Friends" };
		else if (users_list === "followings") users_list = { list: this.state.followersObject.followingsList, title: "Followings" };

		this.setState({ users_list: users_list });
	}

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
					paddingTop: smallScreen ? "15px" : "0px",
					textAlign: smallScreen ? "center" : "left"
				},
				instagram: {
					cursor: "pointer",
					display: !this.state.instagram || this.state.instagram.length === 0 ? "none" : ""
				},
				aboutMe: {
					container: {
						paddingTop: "25px",
						display: !this.state.aboutMe || this.state.aboutMe.length === 0 ? "none" : ""
					},
					text: {
						whiteSpace: "pre-line",
						color: this.props.theme === "dark" ? "white" : ""
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

	closeEditWindow = () => this.setState({ edit: false });
	closeSettingsWindow = () => this.setState({ settings: false });

	render() {
		const smallScreen = this.state.screenWidth < 750;

		if (!this.state.dataRecived) return <Loading />
		else if (this.state.edit) return <EditProfile smallScreen={smallScreen} screenWidth={this.state.screenWidth} currentData={this.state.user} close={this.closeEditWindow} theme={this.props.theme} />
		else if (this.state.settings) return <Settings userData={this.state.user} smallScreen={smallScreen} close={this.closeSettingsWindow} theme={this.props.theme} />
		else if (this.state.error) return <Error message={this.state.error.toString()} />

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
					<div style={styles.firstContainer.main}>
						{/* username */}
						<div style={styles.firstContainer.username}>
							<h2 style={{ color: this.props.theme === "dark" ? "white" : "" }}>
								{this.state.username}
							</h2>
						</div>

						{/* avatar */}
						<div>
							{
								this.state.avatar
									? <img src={this.state.avatar} style={styles.firstContainer.avatar} alt="Failed to load avatar." />
									: <LoadingComponent />
							}
						</div>

						{/* followers */}
						<div style={styles.firstContainer.followers.container}>
							<div style={styles.firstContainer.followers.followers} onClick={() => this.handleClickOpen("followers")}>
								<h5 style={{ color: this.props.theme === "dark" ? "white" : "" }}>{this.state.followers}</h5>
								<h6 style={{ color: this.props.theme === "dark" ? "white" : "" }}>Followers</h6>
							</div>
							<div style={styles.firstContainer.followers.friends} onClick={() => this.handleClickOpen("friends")}>
								<h5 style={{ color: this.props.theme === "dark" ? "white" : "" }}>{this.state.friends}</h5>
								<h6 style={{ color: this.props.theme === "dark" ? "white" : "" }}>Friends</h6>
							</div>
							<div style={styles.firstContainer.followers.followings} onClick={() => this.handleClickOpen("followings")}>
								<h5 style={{ color: this.props.theme === "dark" ? "white" : "" }}>{this.state.following}</h5>
								<h6 style={{ color: this.props.theme === "dark" ? "white" : "" }}>Followings</h6>
							</div>
						</div>

						{/* EDIT AND SETTINGS */}
						<div style={styles.firstContainer.buttons.container}>
							<div>
								<button onClick={this.edit} className="btn btn-primary btn-block"> Edit </button>
							</div>
							<div style={styles.firstContainer.buttons.settings}>
								<button onClick={this.settings} className="btn btn-primary btn-block"> Settings </button>
							</div>
						</div>
					</div>

					<div style={styles.secondContainer.main}>
						{/* Name */}
						<div>
							<h1 style={{ color: this.props.theme === "dark" ? "white" : "" }}>
								{this.state.name} <i
									style={styles.secondContainer.instagram}
									onClick={this.redirectToInst}
									className="fab fa-instagram"
								></i>
							</h1>
						</div>

						{/* About Me */}
						<div style={styles.secondContainer.aboutMe.container}>
							<h4 style={{ color: this.props.theme === "dark" ? "white" : "" }}>About me:</h4>
							<span style={styles.secondContainer.aboutMe.text}> {this.state.aboutMe} </span>
						</div>

						{/* STATS */}
						<div style={styles.secondContainer.stats.container}>
							<div>
								<h4 style={{ color: this.props.theme === "dark" ? "white" : "" }}>Stats <span style={styles.secondContainer.stats.date}>(SINCE {this.state.registerDate})</span></h4>
							</div>

							<div>
								<StatsList theme={this.props.theme} id={localStorage.id} smallScreen={smallScreen} />
							</div>

							<div>
								<DoneChallenges theme={this.props.theme} id={localStorage.id} smallScreen={smallScreen} />
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Profile;