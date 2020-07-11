import React, { Component } from 'react';

class Error extends Component {
    render() {
        return (
            <div style={{ paddingTop: "25px" }}>
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">Something went wrong!</h4>
                    <hr />
                    <p>{this.props.message}</p>

                    <div style={{ display: "flex" }}>
                        <div>
                            <button className="btn btn-danger" onClick={() => window.location.reload()}>Try again</button>
                        </div>
                        <div style={{ paddingLeft: "10px" }} onClick={() => alert("This function doesn't work! Please don't do this anymore!")}>
                            <button className="btn btn-danger">Report bug</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Error;