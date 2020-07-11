import React from 'react';

const LoadingComponent = () => {
    return (
        <div className="text-center text-primary">
            <div className="spinner-grow" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
}

export default LoadingComponent;