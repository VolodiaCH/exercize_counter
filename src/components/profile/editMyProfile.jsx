import React, { Component } from 'react';
import axios from 'axios';
import Error from "../common/error";
import SnackBar from "../common/snackbar";
import EditAvatar from "./common/editAvatar";

class EditProfile extends Component {
    constructor(props) {
        super(props);

        this.chooseFile = this.chooseFile.bind(this);
        this.handleAvatarChange = this.handleAvatarChange.bind(this);
    }

    state = {
        userData: this.props.currentData,
        imgUrl: this.props.currentData.avatar,
        username: this.props.currentData.username,
        name: this.props.currentData.name,
        instagram: this.props.currentData.instagram ? this.props.currentData.instagram : "",
        aboutMe: this.props.currentData.about_me ? this.props.currentData.about_me : "",

        editPhotoUrl: null,
        showEditPhoto: false,

        snackbar: {
            message: "",
            status: "hide"
        },

        errors: {
            username: null,
            name: null,
            instagram: null,
            aboutMe: null
        },

        error: null
    }


    submit = () => {
        const { username, name, instagram, aboutMe, imgUrl } = this.state;
        const values = { username, name, instagram, aboutMe, avatar: imgUrl };
        let errors = { username: null, name: null, instagram: null, aboutMe: null };

        // check if error
        if (name.length > 36) errors.name = "Too long name (max 36)";
        if (instagram.length > 36) errors.instagram = "Too long instagram username (max 36)";
        if (aboutMe.length > 125) errors.aboutMe = "Too long about me (max 66)";
        if (name.length === 0) errors.name = "This field can't be empty.";

        this.setState({ errors });
        if (!Object.values(errors).every(el => el === null)) return false

        // connect ot server => update user data
        axios.put(`${process.env.REACT_APP_API_URL}/updateUserData`, values)
            .then(res => {
                // create success snackbar
                const snackbar = {
                    message: "Changes saved!",
                    status: "success"
                }
                this.setState({ snackbar });

                window.location.reload()
            })
            .catch(error => this.setState({ error }));
    }

    handleUsernameChange = event => this.setState({ username: event.target.value });
    handleNameChange = event => this.setState({ name: event.target.value });
    handleInstagramChange = event => this.setState({ instagram: event.target.value });
    handleAboutMeChange = event => this.setState({ aboutMe: event.target.value });

    chooseFile = () => this.refs.fileUploader.click();

    handleUploadImage = file => {
        this.setState({ showEditPhoto: false });

        const request = new XMLHttpRequest();
        const form = new FormData();
        const photo = file;
        var url;

        form.append('image', photo);

        // create loading snackbar
        const snackbar = {
            message: "Loading...",
            status: "loading"
        }
        this.setState({ snackbar });

        // request to imgur => create avatar url
        request.open('POST', 'https://api.imgur.com/3/image/')
        request.setRequestHeader('Authorization', `Client-ID 2bb92e6d484bcde`)
        request.onreadystatechange = () => {
            if (request.status === 200 && request.readyState === 4) {
                // if success

                // create success snackbar
                const snackbar = {
                    message: "Successfuly uploaded!",
                    status: "success"
                }
                this.setState({ snackbar });

                let res = JSON.parse(request.responseText);
                url = `https://i.imgur.com/${res.data.id}.png`; // recived url

                this.setState({ imgUrl: url });
            } else {
                // if fail

                // create fail snackbar
                const snackbar = {
                    message: "Failed to upload!",
                    status: "fail"
                }
                this.setState({ snackbar });
            }
        }
        request.send(form)
    }

    handleCloseAvatarEdit = () => this.setState({ showEditPhoto: false })

    handleAvatarChange = event => {
        const selecectedPhoto = URL.createObjectURL(event.target.files[0]);
        this.setState({ editPhotoUrl: selecectedPhoto, showEditPhoto: true })
    }

    getStyles = smallScreen => {
        return {
            mainContainer: {
                paddingTop: "20px",
                display: smallScreen ? "" : "flex"
            },
            firstContainer: {
                main: {
                    width: smallScreen ? "100%" : "25%",
                    textAlign: "center",
                },
                username: {
                    overflowWrap: "break-word",
                    float: "center",
                    maxWidth: "300px"
                },
                avatar: {
                    container: {
                        paddingTop: "5px"
                    },
                    img: {
                        cursor: "pointer",
                        width: "100%",
                        borderRadius: "3%"
                    },
                    button: {
                        paddingTop: "5px"
                    },
                    file: {
                        display: "none"
                    }
                },
                buttons: {
                    container: {
                        paddingTop: "25px",
                        display: smallScreen ? "none" : ""
                    },
                    cancel: {
                        paddingTop: "15px"
                    }
                }
            },
            secondContainer: {
                main: {
                    width: smallScreen ? "100%" : "75%",
                    paddingLeft: smallScreen ? "" : "50px"
                },
                name: {
                    container: {
                        width: smallScreen ? "100%" : "300px",
                        // maxWidth: "300px",
                        textAlign: "center",
                        paddingTop: smallScreen ? "20px" : "0px"
                    },
                    input: {
                        borderRadius: "3px",
                    },
                    feedback: {
                        display: this.state.errors.name ? "" : "none"
                    }
                },
                instagram: {
                    container: {
                        width: smallScreen ? "100%" : "300px",
                        // maxWidth: "300px",
                        textAlign: "center",
                        paddingTop: "20px"
                    },
                    input: {
                        borderRadius: "3px",
                        width: smallScreen ? "100%" : "300px"
                    },
                    feedback: {
                        display: this.state.errors.instagram ? "" : "none"
                    }
                },
                aboutMe: {
                    container: {
                        // maxWidth: "300px",
                        width: smallScreen ? "100%" : "300px",
                        paddingTop: "20px",
                        maxHeight: "500px"
                    },
                },
                buttons: {
                    container: {
                        paddingTop: "25px",
                        display: smallScreen ? "" : "none"
                    },
                    cancel: {
                        paddingTop: "15px"
                    }
                }
            }
        }
    }

    render() {
        // handle error
        if (this.state.error) return <Error message={this.state.error.toString()} />;

        // styles
        const smallScreen = this.props.smallScreen;
        const styles = this.getStyles(smallScreen);

        return (
            <div style={styles.mainContainer}>
                <SnackBar
                    message={this.state.snackbar.message}
                    status={this.state.snackbar.status}
                />

                <EditAvatar
                    url={this.state.editPhotoUrl}
                    show={this.state.showEditPhoto}
                    handleClose={this.handleCloseAvatarEdit}
                    handleUploadImage={this.handleUploadImage}

                    screenWidth={this.props.screenWidth}
                />

                {/* FIRST CONTAINER */}
                <div style={styles.firstContainer.main}>
                    {/* username */}
                    <div style={styles.firstContainer.username}>
                        <h2>
                            @{this.state.userData.username}
                        </h2>
                    </div>

                    {/* avatar */}
                    <div style={styles.firstContainer.avatar.container}>
                        <img
                            src={this.state.imgUrl}
                            alt="Avatar"
                            onClick={this.chooseFile}

                            // ref={this.imgRef}
                            ref={ref => this.imageRef = ref}

                            style={styles.firstContainer.avatar.img}
                        />

                        <div style={styles.firstContainer.avatar.button}>
                            <button
                                onClick={this.chooseFile}
                                type="button"
                                className="btn btn-outline-dark btn-block"
                            > Upload new photo </button>
                        </div>

                        <input
                            onChange={this.handleAvatarChange.bind(this)}
                            type="file"
                            id="file"
                            ref="fileUploader"
                            accept="image/*"
                            style={styles.firstContainer.avatar.file}
                        />
                    </div>

                    {/* buttons when normal screen */}
                    <div style={styles.firstContainer.buttons.container}>
                        <div>
                            <button onClick={this.submit} className="btn btn-primary btn-block"> Save changes </button>
                        </div>

                        <div style={styles.firstContainer.buttons.cancel}>
                            <button onClick={this.props.close} className="btn btn-primary btn-block"> Cancel </button>
                        </div>
                    </div>
                </div>


                {/* SECOND CONTAINER */}
                < div style={styles.secondContainer.main}>
                    {/* Name */}
                    <div style={styles.secondContainer.name.container}>
                        <h5>Name:</h5>

                        <input
                            placeholder="Name"
                            className={this.state.errors.name ? "form-control is-invalid" : "form-control"}
                            type="text"
                            style={styles.secondContainer.name.input}

                            value={this.state.name}
                            onChange={this.handleNameChange}
                        />

                        <div className="invalid-feedback" style={styles.secondContainer.name.feedback}>
                            {this.state.errors.name}
                        </div>
                    </div>

                    {/* instagram */}
                    <div style={styles.secondContainer.instagram.container}>
                        <h5>Instagram:</h5>

                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="addon-wrapping">@</span>
                            </div>

                            <input
                                placeholder="instagram"
                                id="instagram-input"
                                className={this.state.errors.instagram ? "form-control is-invalid" : "form-control"}
                                type="text"
                                style={styles.secondContainer.instagram.input}

                                value={this.state.instagram}
                                onChange={this.handleInstagramChange}
                            />

                            <div className="invalid-feedback" style={styles.secondContainer.instagram.feedback}>
                                {this.state.errors.instagram}
                            </div>
                        </div>
                    </div>

                    {/* About me */}
                    <div style={styles.secondContainer.aboutMe.container}>
                        <h4>About me:</h4>
                        <textarea
                            className={this.state.errors.aboutMe ? "form-control is-invalid" : "form-control"}
                            placeholder="About me (0 / 60)"
                            cols="33"
                            rows="5"

                            value={this.state.aboutMe}
                            onChange={this.handleAboutMeChange}
                        ></textarea>

                        <small className="form-text text-muted"> ({this.state.aboutMe.length} / 125) </small>
                    </div>

                    {/* buttons when small screen */}
                    <div style={styles.secondContainer.buttons.container}>
                        <div>
                            <button onClick={this.submit} className="btn btn-primary btn-block"> Save changes </button>
                        </div>

                        <div style={styles.secondContainer.buttons.cancel}>
                            <button onClick={this.cancel} className="btn btn-primary btn-block"> Cancel </button>
                        </div>
                    </div>
                </div >
            </div >
        );
    }
}

export default EditProfile;