import React, { Component } from 'react';
import axios from "axios";
import Error from "../common/error";

class RegisterForm extends Component {
	constructor(props) {
		super(props);

		this.handleUsernameChange = this.handleUsernameChange.bind(this);
		this.handleNameChange = this.handleNameChange.bind(this);
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	state = {
		page: { username: '', name: '', password: '', confirmPassword: '' },
		errors: { username: '', name: '', password: '', confirmPassword: '' },

		screenWidth: null,
		screenHeight: null
	}

	//-----------------get screen size
	componentDidMount() {
		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions);
	}

	componentWillUnmount = () => window.removeEventListener('resize', this.updateWindowDimensions);

	updateWindowDimensions = () => this.setState({ screenWidth: window.innerWidth, screenHeight: window.innerHeight });
	//-----------------get screen size

	handleSubmit = event => {
		event.preventDefault();

		let { page } = this.state;
		let errors = { username: '', name: '', password: '', confirmPassword: '' };

		// handle errors
		if (!/^[a-zA-Z1-9_]+$/.test(page.username)) errors.username = "Username must contain only letters, numbers and underlines.";
		// if (!/^[a-z A-Z йцукенгшщзхїфівапролджєячсмитьбю ЙЦУКЕНГШЩЩЗХЇФІВАПРОЛДЖЄЯЧСМИТЬБЮ]+$/.test(page.name)) errors.name = "Name must contain only letters.";
		if (!/^[a-zA-Z1-9]+$/.test(page.password)) errors.password = "Password must contain only letters and numbers.";
		if (page.username.length === 0) errors.username = "This field can't be empty.";
		if (page.username.length > 36) errors.username = "Too long username (36 - max).";
		if (page.password.length > 64) errors.password = "Too long password (64 - max).";
		if (page.name.length === 0) errors.name = "This field can't be empty.";
		if (page.password.length < 5) errors.password = "Password must contain 5 or more symbols.";
		if (page.confirmPassword !== page.password) errors.confirmPassword = "Passwords do not match.";
		if (page.confirmPassword.length === 0) errors.confirmPassword = "This field can't be empty.";

		// if error - return it
		if (!Object.values(errors).every(elem => elem === "")) return this.setState({ errors });

		// create new user
		axios.post('http://localhost:3000/api/register', this.state)
			.then(result => {
				if (result.data === "This username is already taken.") {
					// if error

					errors.username = result.data;
					return this.setState({ errors });
				} else {
					// if success

					// writing token, id, username to localStorage
					localStorage.setItem("token", result.data.token);
					localStorage.setItem("id", result.data.userData.id.toString());
					localStorage.setItem("username", result.data.userData.username);

					// set authorization header with JWT token
					axios.defaults.headers.common['Authorization'] = `${result.data.token}`;

					// create nofication --->
					// nofication values
					const values = {
						values: [result.data.userData.id, `Welcome to exercize counter! Let's do some exercizes!`],
						forFollowers: false
					};

					// post values to `nofications` DB
					axios.post(`http://localhost:3000/api/create-nofications`, values)
						.catch(error => this.setState({ error }));

					window.location = "/profile";
				}
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
	handleNameChange = event => {
		const value = event.target.value;

		this.setState(prevState => ({
			page: {
				...prevState.page,
				name: value
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
	handleConfirmPasswordChange = event => {
		const value = event.target.value;

		this.setState(prevState => ({
			page: {
				...prevState.page,
				confirmPassword: value
			}
		}))
	}

	render() {
		// handle error
		if (this.state.error) return <Error message={this.state.error.toString()} />

		const smallScreen = this.state.screenWidth < 400;
		let inputClass = "form-control";
		let inputErrorClass = inputClass + " is-invalid"

		let { page, errors } = this.state;

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
			<div className="row" style={mainDivStyle}>
				<div className="col">
					<h1>Register</h1>

					<form onSubmit={this.handleSubmit} style={{ float: "center" }}>
						{/* USERNAME */}
						<div className="input-group mb-3">
							<div className="input-group-prepend">
								<span className="input-group-text" id="basic-addon1">@</span>
							</div>
							<input
								style={{ borderRadius: "3px" }}
								type="text"
								className={errors.username.length === 0 ? inputClass : inputErrorClass}
								placeholder="Username"
								aria-label="username"
								id="username"
								value={page.username} onChange={this.handleUsernameChange}
							/>

							<div className="invalid-feedback" style={{ display: errors.username.length === 0 ? "none" : "block" }}>
								{errors.username}
							</div>
						</div>

						{/* NAME */}
						<div className="input-group mb-3">
							<input
								style={{ borderRadius: "3px" }}
								type="text"
								className={errors.name.length === 0 ? inputClass : inputErrorClass}
								placeholder="Name"
								aria-label="name"
								id="name"
								value={page.name} onChange={this.handleNameChange}
							/>

							<div className="invalid-feedback" style={{ display: errors.name.length === 0 ? "none" : "block" }}>
								{errors.name}
							</div>
						</div>


						{/* PASSWORD */}
						<div className="input-group mb-3">
							<input
								style={{ borderRadius: "3px" }}
								type="password"
								className={errors.password.length === 0 ? inputClass : inputErrorClass}
								placeholder="Password"
								aria-label="password"
								id="password"
								value={page.password} onChange={this.handlePasswordChange}
							/>

							<div className="invalid-feedback" style={{ display: errors.password.length === 0 ? "none" : "block" }}>
								{errors.password}
							</div>
						</div>

						{/* CONFIRM PASSWORD */}
						<div className="input-group mb-3">
							<input
								style={{ borderRadius: "3px" }}
								type="password"
								className={errors.confirmPassword.length === 0 ? inputClass : inputErrorClass}
								placeholder="Confirm Password"
								aria-label="confirm password"
								id="confirmPassword"
								value={page.confirmPassword} onChange={this.handleConfirmPasswordChange}
							/>

							<div className="invalid-feedback" style={{ display: errors.confirmPassword.length === 0 ? "none" : "block" }}>
								{errors.confirmPassword}
							</div>
						</div>

						{/* SUBMIT */}
						<div className="input-group mb-3">
							<button className="btn btn-primary">Register</button>
							<div style={{ paddingLeft: "10px", paddingTop: "6px" }}>
								<a href="/login">Already have account?</a>
							</div>
						</div>
					</form>
				</div>
			</div>
		);
	}
}

export default RegisterForm;