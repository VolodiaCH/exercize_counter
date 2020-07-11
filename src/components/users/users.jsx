import React, { Component } from 'react';
import axios from "axios";
import Loading from "../common/loading";
import Error from "../common/error";
import Sort from "../common/sort";
import Paginate from "../common/paginate";
import Avatar from '@material-ui/core/Avatar';

class Users extends Component {
	state = {
		users: null,
		usersList: [],
		followingsList: [],

		screenWidth: null,
		screenHeight: null,

		currentPage: 1,
		itemsOnPage: 7,

		sortReq: null,

		error: null
	}

	componentDidMount() {
		if (localStorage.length === 0) window.location = "/login";

		this.getListOfUsers();
		this.getFollowersList();

		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions);
	}

	//-----------------get screen size
	componentWillUnmount = () => window.removeEventListener('resize', this.updateWindowDimensions);
	updateWindowDimensions = () => this.setState({ screenWidth: window.innerWidth, screenHeight: window.innerHeight });
	//-----------------get screen size

	getListOfUsers() {
		axios.defaults.headers.common['Authorization'] = `${localStorage.token}`;
		axios.get('http://localhost:3000/api/list-of-users')
			.then(res => this.setState({ users: res.data }))
			.catch(error => this.setState({ error }));
	}

	getFollowersList() {
		axios.defaults.headers.common['Authorization'] = `${localStorage.token}`;
		axios.get('http://localhost:3000/api/followers')
			.then(res => {
				const id = parseInt(localStorage.id);
				const followingsList = res.data.filter(elem => elem.follower_id === id);
				this.setState({ followingsList });
			})
			.catch(error => this.setState({ error }));
	}

	handleFollow = id => {
		if (localStorage.length === 0) window.location = "/login"

		axios.defaults.headers.common['Authorization'] = `${localStorage.token}`;
		axios.post('http://localhost:3000/api/follow?' + id)
			.then(result => {
				const newRecord = {
					user_id: id,
					follower_id: parseInt(localStorage.id)
				};

				let followingsList = this.state.followingsList;
				followingsList.push(newRecord);

				this.setState({ followingsList });
			})
			.catch(error => this.setState({ error }));

		const values = {
			values: [id, `@${localStorage.username} started following you.`],
			forFollowers: false
		};
		axios.post(`http://localhost:3000/api/create-nofications`, values)
			.catch(error => this.setState({ error }));
	}

	handleUnFollow = id => {
		if (localStorage.length === 0) window.location = "/login"

		axios.defaults.headers.common['Authorization'] = `${localStorage.token}`;
		axios.delete('http://localhost:3000/api/unfollow?' + id)
			.then(result => {
				const followingsList = this.state.followingsList.filter(record => id !== record.user_id);

				this.setState({ followingsList });
			})
			.catch(error => this.setState({ error }));
	}

	handleSort = values => this.setState({ sortReq: values });

	sort = (users, sort_req) => {
		if (sort_req.sortBy === "New") {
			const sorted_users = users.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

			if (sort_req.search !== "") {
				if (sort_req.searchBy === "Name") {
					return sorted_users.filter(elem => elem.name.toLowerCase().startsWith(sort_req.search.toLowerCase()));
				} else if (sort_req.searchBy === "Username") {
					return sorted_users.filter(elem => elem.username.toLowerCase().startsWith(sort_req.search.toLowerCase()));
				}
			} else return sorted_users
		}
		else if (sort_req.sortBy === "Old") {
			const sorted_users = users.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

			if (sort_req.search !== "") {
				if (sort_req.searchBy === "Name") {
					return sorted_users.filter(elem => elem.name.toLowerCase().startsWith(sort_req.search.toLowerCase()));
				} else if (sort_req.searchBy === "Username") {
					return sorted_users.filter(elem => elem.username.toLowerCase().startsWith(sort_req.search.toLowerCase()));
				}
			} else return sorted_users
		} else {
			if (sort_req.search !== "") {
				if (sort_req.searchBy === "Name") {
					return users.filter(elem => elem.name.toLowerCase().startsWith(sort_req.search.toLowerCase()));
				} else if (sort_req.searchBy === "Username") {
					return users.filter(elem => elem.username.toLowerCase().startsWith(sort_req.search.toLowerCase()));
				}
			} else return users
		}
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

	render() {
		if (!this.state.usersList || !this.state.followingsList || !this.state.users) return <Loading />
		else if (this.state.error) return <Error message={this.state.error.toString()} />

		const smallScreen = this.state.screenWidth < 500;
		const verySmallScreen = this.state.screenWidth < 350;
		const nameStyle = { display: smallScreen ? "none" : "" }

		const followings = this.state.followingsList.map(elem => elem.user_id);

		let sortedUsers;
		if (this.state.sortReq) sortedUsers = this.sort(this.state.users, this.state.sortReq);
		else sortedUsers = this.state.users;

		const sortBy = ["New", "Old"];
		const searchBy = ["Name", "Username"];

		const page = this.renderPage(sortedUsers);

		return (
			<div style={{ paddingTop: "40px" }}>
				<div>
					<Sort
						sortBy={sortBy}
						searchBy={searchBy}
						handleSort={this.handleSort}
						smallScreen={smallScreen}
					/>
				</div>

				<div style={{ paddingTop: "20px" }}>
					{page.map(user => {
						// don't display if current dispalying user is me
						if (user.id === parseInt(localStorage.id)) return <div key="me"></div>

						// is current displaying user is followed by authorised user 
						let followed = false;
						followings.forEach(id => user.id === id ? followed = true : null);

						let username = `@${user.username}`;

						// if very small screen and username length >= 15 replace letters with index more than 15 with "..."
						if (username.length > 13 && verySmallScreen) username = username.slice(0, 13) + "...";

						const avatarStyles = { width: "30px", height: "30px", cursor: "pointer" };
						const avatar = user.avatar
							? <Avatar src={user.avatar} style={avatarStyles} />
							: <Avatar src="/broken-image.jpg" style={avatarStyles} />

						return (
							<div key={user.id}>
								<hr />
								<div style={{ fontSize: "20px", display: "flex", justifyContent: "space-between" }}>
									<div onClick={() => window.location = "/userprofile?username=" + user.username} style={{ display: "flex" }}>
										{avatar}
										<span style={{ cursor: "pointer", paddingLeft: "10px" }}>
											{username} <span style={nameStyle}> ({user.name}) </span>
										</span>
									</div>

									<div>
										{
											followed
												? <button className="btn btn-outline-primary btn-sm" onClick={() => this.handleUnFollow(user.id)}> Unfollow </button>
												: <button className="btn btn-primary btn-sm" onClick={() => this.handleFollow(user.id)}> Follow </button>
										}
									</div>
								</div>
							</div>
						);
					})}
				</div>
				<hr />
				<div style={{ paddingTop: "10px" }}>
					<Paginate
						list={this.state.users}
						currentPage={this.state.currentPage}
						changePage={this.changePage}
						itemsOnPage={this.state.itemsOnPage}
					/>
				</div>
			</div>
		);
	}
}

export default Users;