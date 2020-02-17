import createAuth0Client from "@auth0/auth0-spa-js";

const loginWithPopup = (dispatch, getState) => async (auth0Client, params = {}) => {
  dispatch({ popupOpen: true });

  try {
    await auth0Client.loginWithPopup(params);
  } catch (error) {
    console.error(error);
  } finally {
    dispatch({ popupOpen: false });
  }
  const user = await auth0Client.getUser();
  dispatch({ user, isAuthenticated: true });
}

const handleRedirectCallback = (dispatch, getState) => async (auth0Client) => {
  dispatch({ loading: true });

  await auth0Client.handleRedirectCallback();
  const user = await auth0Client.getUser();
  dispatch({ user, loading: false, isAuthenticated: true });
};

const initializeHandler = (dispatch, getState) => async (initOptions, onRedirectCallback) => {
  const auth0FromHook = await createAuth0Client(initOptions);

  if (
    window.location.search.includes("code=") &&
    window.location.search.includes("state=")
  ) {
    const { appState } = await auth0FromHook.handleRedirectCallback();
    onRedirectCallback(appState);
  }

  const isAuthenticated = await auth0FromHook.isAuthenticated();
  let user = {};

  dispatch({ isAuthenticated });

  if (isAuthenticated) {
    user = await auth0FromHook.getUser();
  }

  dispatch({ isAuthenticated, user, auth0Client: auth0FromHook, loading: false });
};


const getIdTokenClaims = (dispatch, getState) => (...args) => {
  const { auth0Client } = getState();

  auth0Client.getIdTokenClaims(...args);
};

const loginWithRedirect = (dispatch, getState) => (...args) => {
  const { auth0Client } = getState();

  auth0Client.loginWithRedirect(...args);
};

const getTokenSilently = (dispatch, getState) => (...args) => {
  const { auth0Client } = getState();

  auth0Client.getTokenSilently(...args);
};

const getTokenWithPopup = (dispatch, getState) => (...args) => {
  const { auth0Client } = getState();

  auth0Client.getTokenWithPopup(...args);
};

const logout = (dispatch, getState) => (...args) => {
  const { auth0Client } = getState();

  auth0Client.logout(...args);
}


const actions = {
  loginWithPopup,
  handleRedirectCallback,
  initializeHandler,
  getIdTokenClaims,
  loginWithRedirect,
  getTokenSilently,
  getTokenWithPopup,
  logout,
};

export default actions;
  