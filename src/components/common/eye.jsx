import React from 'react';

const Eye = props => {
    let className = "far fa-eye";
    if (props.show) className += "-slash";

    return (
        <i
            onClick={props.onClick}
            style={{ cursor: "pointer" }}
            className={className}
            aria-hidden="true"
        />
    );
}

export default Eye;