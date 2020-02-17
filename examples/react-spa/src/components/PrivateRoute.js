import React, { useEffect } from "react";
import { Route, withRouter } from "react-router-dom";
import { withAuth } from '../auth-store';

const PrivateRoute = ({ component: Component, path, location, isAuthenticated, loginWithRedirect, ...rest }) => {
  useEffect(() => {
    const fn = async () => {
      if (!isAuthenticated) {
        await loginWithRedirect({
          appState: { targetUrl: location.pathname }
        });
      }
    };
    fn();
  }, [isAuthenticated, loginWithRedirect, path, location]);

  const render = props =>
    isAuthenticated === true ? <Component {...props} /> : null;

  return <Route path={path} render={render} {...rest} />;
};

export default withRouter(withAuth(PrivateRoute, {
  stateSelectors: ['isAuthenticated'],
  actionSelectors: ['loginWithRedirect'],
}));
