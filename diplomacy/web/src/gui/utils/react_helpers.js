import React from 'react';
import {ErrorBoundary} from 'react-error-boundary';
import PropTypes from "prop-types";

function ErrorFallback({error}) {
    return (
        <div>
            The application has encountered a severe error. Please reload  and rejoin your game.
            <p>
                Details: {error}
            </p>
        </div>
    );
}
ErrorFallback.propTypes = {
    error: PropTypes.object
};

export const CatchAllErrors = ({children}) => (
  <ErrorBoundary
    FallbackComponent={ErrorFallback}>
        {children}
  </ErrorBoundary>
);

CatchAllErrors.propTypes = {
    children: PropTypes.node.isRequired
};
