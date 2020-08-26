import React, { Component } from 'react';
import axios from "axios";
// import Eye from "../common/eye"
import Error from "../common/error";

class LoginForm extends Component {
	constructor(props) {
		super(props);

		this.handleUsernameChange = this.handleUsernameChange.bind(this);
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	state = {
		page: { username: '', password: '' },
		errors: { username: '', password: '' },
		showPassword: false,
		screenWidth: null,
		screenHeight: null
	}

	showHidePassword = () => {
		this.setState({ showPassword: !this.state.showPassword });
	}

	handleSubmit = event => {
		event.preventDefault();
		let { page } = this.state;
		let errors = { username: '', password: '' };

		// check errors
		if (page.username.length === 0) errors.username = "This field can't be empty.";
		if (page.password.length === 0) errors.password = "This field can't be empty.";

		if (!Object.values(errors).every(elem => elem === "")) return this.setState({ errors });

		// handle login
		axios.post(process.env.REACT_APP_API_URL + '/login', this.state)
			.then(res => {
				// check if wrong username or password
				if (res.data === "Wrong username.") errors.username = res.data;
				else if (res.data === "Wrong password.") errors.password = res.data;

				if (!Object.values(errors).every(elem => elem === "")) return this.setState({ errors });

				// write token, id, username to localStorage
				localStorage.setItem("token", res.data.token);
				localStorage.setItem("id", res.data.userData.id.toString());
				localStorage.setItem("username", res.data.userData.username);

				window.location = "/home";
			})
			.catch(error => this.setState({ error }));
	}

	handleUsernameChange = event => {
		const value = event.target.value;

		this.setState(prevState => ({
			page: {
				...prevState.page,
				username: value
			}
		}))
	}
	handlePasswordChange = event => {
		const value = event.target.value;

		this.setState(prevState => ({
			page: {
				...prevState.page,
				password: value
			}
		}))
	}

	// get screen size
	componentDidMount() {
		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions);
	}
	componentWillUnmount = () => window.removeEventListener('resize', this.updateWindowDimensions);
	updateWindowDimensions = () => this.setState({ screenWidth: window.innerWidth, screenHeight: window.innerHeight });

	render() {
		if (this.state.error) return <Error message={this.state.error} />

		const smallScreen = this.state.screenWidth < 400;
		let inputClass = "form-control";
		let inputErrorClass = inputClass + " is-invalid"

		let { page, errors, showPassword } = this.state;

		// const iconClass = {
		// 	position: "absolute",
		// 	right: "6px",
		// 	padding: "7px",
		// 	transform: "translateY(-50 %)"
		// }

		let mainDivStyle = {
			paddingTop: "15px",
			paddingLeft: "25%",
			paddingRight: "25%"
		}

		if (smallScreen) {
			mainDivStyle.paddingLeft = "5%"
			mainDivStyle.paddingRight = "5%"
		}

		return (
			<div style={mainDivStyle}>
				<h1>Login</h1>

				<form onSubmit={this.handleSubmit} style={{ float: "center" }}>
					{/* USERNAME */}
					<div className="input-group mb-3">
						<div className="input-group-prepend">
							<span className="input-group-text" id="basic-addon1">@</span>
						</div>

						<input
							type="text"
							style={{ borderRadius: "3px" }}
							className={errors.username.length === 0 ? inputClass : inputErrorClass}
							placeholder="Username"
							aria-label="username"
							id="username"
							value={page.username}
							onChange={this.handleUsernameChange}
						/>

						<div className="invalid-feedback" style={{ display: errors.username.length === 0 ? "none" : "" }}>
							{errors.username}
						</div>
					</div>

					{/* PASSWORD */}
					<div className="input-group mb-3">
						<input
							type={showPassword ? "text" : "password"}
							style={{ borderRadius: "3px" }}
							className={errors.password.length === 0 ? inputClass : inputErrorClass}
							placeholder="Password"
							aria-label="password"
							id="password"
							value={page.password}
							onChange={this.handlePasswordChange}
						/>
						{/* <div style={{ iconClass }}>
							<Eye onClick={this.showHidePassword} show={showPassword} />
						</div> */}

						<div className="invalid-feedback" style={{ display: errors.password.length === 0 ? "none" : "" }}>
							{errors.password}
						</div>
					</div>

					{/* SUBMIT */}
					<div className="input-group mb-3">
						<button className="btn btn-primary">Login</button>
						<div style={{ paddingLeft: "10px", paddingTop: "6px" }}>
							<a href="/register">Dont have account?</a>
						</div>
					</div>
				</form>
			</div >
		);
	}
}

export default LoginForm;