import React, { Component } from 'react';

class NotFound extends Component {
    state = {}
    render() {
        return (
            <div style={{ paddingTop: "10px" }}>
                <span style={{ fontSize: "100px" }}>404</span>
                <h3>Page you are looking for does not exist</h3>
                <br />
                <h4>Maybe user profile has been deleted or username changed.</h4>
                <button type="button" className="btn btn-primary" onClick={() => window.location = "/home"}>Go home</button>
            </div>
        );
    }
}

export default NotFound;
