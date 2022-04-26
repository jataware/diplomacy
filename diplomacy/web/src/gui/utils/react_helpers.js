import React from 'react';
import {ErrorBoundary} from 'react-error-boundary';
import PropTypes from "prop-types";

function ErrorFallback({error}) {
    return (
        <div>
            Error...
            <p>
                {error}
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
