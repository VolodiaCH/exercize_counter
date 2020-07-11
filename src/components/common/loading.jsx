import React from 'react';

const Loading = () => {
    return (
        // <div className="text-center text-primary" style={{ display: "grid", placeItems: "center" }}>
        // <div className="text-center text-primary" style={{ display: "grid", placeItems: "center", justifyItems: "center", alignItems: "center" }}>
        <div className="text-center text-primary" style={{ paddingTop: "25%" }}>
            <div className="spinner-border" style={{ width: "3em", height: "3em" }} role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div >
    );
}

export default Loading;