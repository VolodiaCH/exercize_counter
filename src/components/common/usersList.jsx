import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import axios from "axios";
import Error from "../common/error";
import Avatar from '@material-ui/core/Avatar';

class UsersList extends Component {
    state = {
        users: null,
        followers_list: null,

        error: null
    }

    componentDidMount = () => this.getData();

    getData = () => {
        // set authorization header with JWT token
        axios.defaults.headers.common['Authorization'] = `${localStorage.token}`;

        // get list of users
        axios.get('http://localhost:3000/api/list-of-users')
            .then(res => this.setState({ users: res.data }))
            .catch(error => this.setState({ error }));

        // get list of followers 
        axios.get('http://localhost:3000/api/followers')
            .then(res => this.setState({ followers_list: res.data.filter(elem => elem.follower_id === parseInt(localStorage.id)) }))
            .catch(error => this.setState({ error }));
    }

    handleClose = () => this.props.handleClose;

    handleFollow = id => {
        // set authorization header with JWT token
        axios.defaults.headers.common['Authorization'] = `${localStorage.token}`;

        // handle follow
        axios.post('http://localhost:3000/api/follow?' + id)
            .then(result => {
                // adding new record to followers_list
                const newRecord = {
                    user_id: id,
                    follower_id: parseInt(localStorage.id)
                };

                let followers_list = this.state.followers_list;
                followers_list.push(newRecord);

                this.setState({ followers_list });
            })
            .catch(error => this.setState({ error }));

        // create nofication for followed user --->

        // insert values
        const values = {
            values: [id, `@${localStorage.username} started following you.`],
            forFollowers: false
        };

        // post nofication to `nofications` DB
        axios.post(`http://localhost:3000/api/create-nofications`, values)
            .catch(error => this.setState({ error }));
    }

    getUTC = date => new Date(date.getTime() + date.getTimezoneOffset() * 60000);

    handleUnFollow = id => {
        // set authorization header with JWT token
        axios.defaults.headers.common['Authorization'] = `${localStorage.token}`;

        // handle unfollow
        axios.delete('http://localhost:3000/api/unfollow?' + id)
            .then(result => {
                // deleting record from followers_list 
                const followers_list = this.state.followers_list.filter(record => id !== record.user_id);

                this.setState({ followers_list });
            })
            .catch(error => this.setState({ error }));
    }

    redirectToUserProfile = username => window.location = "/userprofile?username=" + username;

    render() {
        if (!this.state.users) return <div></div>;
        else if (this.state.error) return <Error message={this.state.error.toString()} />

        const smallScreen = this.props.screenWidth < 350;

        return (
            <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" open={this.props.list ? true : false}>
                <DialogTitle id="simple-dialog-title">
                    {this.props.title}
                    <i
                        onClick={this.props.handleClose}
                        className="fas fa-times"
                        style={{
                            cursor: "pointer",
                            float: "right",
                            paddingTop: "7px"
                        }}
                    ></i>
                </DialogTitle>
                <List>
                    {
                        this.props.list
                            ? <div>
                                {
                                    this.props.list.map(user => {
                                        // get current user data
                                        const current_user = this.state.users.filter(elem => {
                                            if (this.props.title === "Followings") return user.user_id === elem.id
                                            else return user.follower_id === elem.id
                                        })[0];

                                        // check if current user followed
                                        let followed = false;
                                        this.state.followers_list.forEach(id => {
                                            if (current_user.id === id.user_id) followed = true
                                        });

                                        // check if current user === authorised user
                                        const me = current_user.id === parseInt(localStorage.id);

                                        let username = `${current_user.username}`;

                                        // if very small screen and username length >= 10 replace letters with index more than 10 with "..."
                                        if (username.length > 10 && smallScreen) username = username.slice(0, 10) + "...";

                                        // avatar
                                        const avatarStyle = { width: "25px", height: "25px", cursor: "pointer" };
                                        const avatar = current_user.avatar
                                            ? <Avatar src={current_user.avatar} style={avatarStyle} />
                                            : <Avatar src="/broken-image.jpg" style={avatarStyle} />

                                        const button = followed
                                            ? <button style={{ float: "right" }} className="btn btn-outline-primary btn-sm" onClick={() => this.handleUnFollow(current_user.id)}> Unfollow </button>
                                            : <button style={{ float: "right" }} className="btn btn-primary btn-sm" onClick={() => this.handleFollow(current_user.id)}> Follow </button>

                                        return (
                                            <ListItem key={current_user.id} button>
                                                {avatar}
                                                &nbsp;
                                                    {/* username */}
                                                @<ListItemText primary={username} onClick={() => this.redirectToUserProfile(current_user.username)} button />
                                                &nbsp;
                                                &nbsp;
                                                {
                                                    me
                                                        ? <div></div>
                                                        : button
                                                }
                                            </ListItem>
                                        )
                                    })
                                }
                            </div>
                            : <div></div>
                    }
                </List>
            </Dialog >
        );
    }
}

export default UsersList;