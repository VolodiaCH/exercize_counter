import React, { Component } from 'react';

class Like extends Component {
    handleLike = () => this.props.handleLike()

    render() {
        const className = this.props.active ? "fas fa-heart" : "far fa-heart";

        return (
            <div>
                <i
                    className={className}
                    onClick={this.handleLike}
                    style={{
                        cursor: "pointer"
                    }}
                >{this.props.likes}</i>
            </div>
        );
    }
}

export default Like;