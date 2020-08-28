import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import Avatar from '@material-ui/core/Avatar';
import axios from "axios";
import Badge from '@material-ui/core/Badge';

class NavBar extends Component {
	state = {
		screenWidth: null,
		screenHeight: null,
		showDropDown: false,
		authorised: null,

		avatar: null,
		nofications: null,

		logOutColor: "#999C9F"
	}

	componentDidMount() {
		// resize listener
		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions);

		// check if authorised
		if (!localStorage.token) return this.setState({ authorised: false });
		else this.setState({ authorised: true });

		// set authorization header with JWT token
		axios.defaults.headers.common['Authorization'] = `${localStorage.token}`;

		// get authorised user data
		axios.get(`${process.env.REACT_APP_API_URL}/myProfile`)
			.then(res => this.setState({ avatar: res.data.avatar }))
			.catch(error => this.setState({ error }));

		// get nofication
		axios.get(`${process.env.REACT_APP_API_URL}/get-nofications`)
			.then(result => this.setState({ nofications: result.data.filter(elem => !elem.seen) }))
			.catch(error => this.setState({ error }));
	}

	// get screen size
	componentWillUnmount = () => window.removeEventListener('resize', this.updateWindowDimensions);
	updateWindowDimensions = () => this.setState({ screenWidth: window.innerWidth, screenHeight: window.innerHeight });

	showHideDropDown = () => this.setState({ showDropDown: !this.state.showDropDown });

	logOut = () => {
		localStorage.clear();
		this.setState({ authorised: false });
		window.location = "/login";
	}

	changeColor = color => this.setState({ logOutColor: color });

	render() {
		const showLables = this.state.screenWidth > 450 ? "" : "none"; // showLables if big screen - yes; else - no

		const menuStyle = this.state.authorised ? "" : "none";

		const signOutStyle = this.state.authorised ? "" : "none";
		const signInStyle = this.state.authorised ? "none" : "";

		const defaultProps = {
			color: 'secondary',
			children: <i style={{ fontSize: "20px" }} className="fas fa-bell"></i>
		}

		// useen nofications count
		const nofications = this.state.nofications ? this.state.nofications.length : 0;

		return (
			<nav className="navbar navbar-expand navbar-dark bg-dark">
				<div className="navbar-collapse collapse justify-content-between" id="navbarNavAltMarkup">
					{/* left menu */}
					<ul className="navbar-nav">
						{/* home */}
						<li className="nav-item" style={{ display: menuStyle }}>
							<NavLink className="nav-link" to={"/home"}>
								<i className="fas fa-home"></i> <span style={{ display: showLables }}>Home</span>
							</NavLink>
						</li>
						{/* profile */}
						<li className="nav-item" style={{ display: menuStyle }}>
							<NavLink className="nav-link" to={"/profile"}>
								<i className="fas fa-user"></i> <span style={{ display: showLables }}>Profile</span>
							</NavLink>
						</li>
						{/* users */}
						<li className="nav-item" style={{ display: menuStyle }}>
							<NavLink className="nav-link" to={"/users"}>
								<i className="fas fa-users"></i> <span style={{ display: showLables }}>Users</span>
							</NavLink>
						</li>
					</ul>

					{/* right menu */}
					<ul className="navbar-nav">
						{/* login */}
						<li className="nav-item">
							<NavLink className="nav-link" to="/login" style={{ display: signInStyle }}>
								Login
          					</NavLink>
						</li>

						{/* register */}
						<li className="nav-item">
							<NavLink className="nav-link" to="/register" style={{ display: signInStyle }}>
								Register
          					</NavLink>
						</li>

						{/* logout */}
						<li style={{ display: showLables }} className="navbar-nav">
							<button
								className="btn"
								onClick={this.logOut}

								onMouseOver={() => this.changeColor("#CCCDCF")}
								onMouseOut={() => this.changeColor("#999C9F")}

								style={{
									float: "right",
									display: signOutStyle,
									color: this.state.logOutColor
								}}
							> Log Out </button>
						</li>

						{/* noficaitons */}
						<li className="nav-item" style={{ display: menuStyle }}>
							<NavLink className="nav-link" to="/nofications">
								<Badge badgeContent={nofications} variant="dot" {...defaultProps} />
							</NavLink>
						</li>

						<li className="nav-item">
							<div className="nav-link">
								<i
									style={{
										fontSize: "22px",
										display: this.props.theme === "dark" ? "" : "none"
									}}

									className="fas fa-sun"
									onClick={this.props.changeTheme}
								></i>
								<i
									style={{
										fontSize: "22px",
										display: this.props.theme === "dark" ? "none" : ""
									}}

									className="far fa-sun"
									onClick={this.props.changeTheme}
								></i>
							</div>
						</li>

						{/* avatar */}
						<li className="nav-item dropdown dropleft" style={{ display: this.state.authorised ? "" : "none" }}>
							<div id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={this.showHideDropDown}>
								{
									this.state.avatar
										? <Avatar alt="avatar" src={this.state.avatar} style={{ width: "35px", height: "35px", cursor: "pointer" }} /> // if avatar exist show it
										: <Avatar src="/broken-image.jpg" style={{ width: "35px", height: "35px", cursor: "pointer" }} /> // else show "no avatar" image
								}
							</div>

							{/* dropdown menu (from avatar) */}
							<div className={this.state.showDropDown ? "dropdown-menu show" : "dropdown-menu"} aria-labelledby="navbarDropdown">
								<button className="dropdown-item" onClick={() => window.location = "/login"}>
									Login
								</button>

								<button className="dropdown-item" onClick={() => window.location = "/register"}>
									Register
								</button>

								<div className="dropdown-divider"></div>

								<button onClick={this.logOut} className="dropdown-item">
									Log Out
								</button>
							</div>
						</li>
					</ul>
				</div>
			</nav >
		);
	}
}

export default NavBar;