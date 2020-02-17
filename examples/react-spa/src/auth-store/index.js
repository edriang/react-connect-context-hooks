import createContextProvider, { connectContextFactory } from 'react-connect-context-hooks';

import actions from './authActions';

const initialState = {
    isAuthenticated: false,
    user: {},
    auth0Client: {},
    loading: true,
    popupOpen: false,
}

const [Auth0Provider, Auth0Context] = createContextProvider(initialState, actions);

const withAuth = connectContextFactory(Auth0Context);

export default Auth0Provider;

export {
    withAuth,
};

