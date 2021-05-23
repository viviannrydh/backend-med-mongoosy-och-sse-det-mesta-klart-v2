import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, useHistory }
  from "react-router-dom";
import { withContext, useNamedContext, Style, If, Else }
  from 'react-easier';
import StartPage from './StartPage';
import RegisterPage from './RegisterPage';
import LoginPage from './LoginPage';
import mongoosy from 'mongoosy/frontend';
import UploadPhotoPage from './UploadPhotoPage';
import CameraPage from './CameraPage';
const { Login } = mongoosy;

// This shouldn't be needed but ensures that 
// we do not get any resets of these context vars
let photos = [], messages = [];

export default withContext('global', {
  // GLOBAL CONTEXT
  user: false,
  sseConnecton: false,
  display: null,
  photos,
  messages
}, function App() {

  // LOGIC
  const g = useNamedContext('global');
  const history = useHistory();

  // start an SSE connection or close it if no user
  const startSSE = user => {
    // someone has been logged in but has now logged out
    // close sse connection and empty messages and photos
    if (!user && g.sseConnection) {
      g.sseConnection.close();
      photos = g.photos = [];
      messages = g.messages = [];
      return;
    }
    // we already have a sse connection (and are logged in)
    if (g.sseConnection) { return; }
    // logged in and not sse connection - so create one
    let sse = new EventSource('/api/sse');
    // add photos from sse
    sse.addEventListener('photos',
      e => photos = g.photos = [...photos, ...JSON.parse(e.data)]
    );
    // add messages from sse
    sse.addEventListener('messages',
      e => messages = g.messages = [...messages, ...JSON.parse(e.data)]
    );
    g.sseConnection = sse;
  }

  // check if a user is logged in and who it is
  const loginCheck = async () => {
    let user = await Login.check();
    startSSE(user);
    g.user = user.js.email ? user : false;
    g.display = true;
  }

  // when the App mounts
  useEffect(() => loginCheck(), []);

  // logout
  const logout = async e => {
    e.preventDefault();
    await Login.logout();
    loginCheck();
    // redirect to the start page
    history.push('/');
  }

  // TEMPLATE
  const render = () => g.display && <Style css={css()}>
    <Router>

      <nav>
        <Link to="/">Home</Link>
        <If c={g.user}>
          <p>Logged in as {g.user.name} ({g.user.email})</p>
          <p><a href="#" onClick={logout}>Log out</a></p>
          <Else>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </Else>
        </If>
        <hr />
      </nav>

      <Switch>
        <Route exact path="/">
          <If c={g.user}>
            <StartPage />
            <Else>
              <h1>Welcome</h1>
            </Else>
          </If>
        </Route>
        <Route path="/register">
          <RegisterPage {...{ loginCheck }} />
        </Route>
        <Route path="/login">
          <LoginPage {...{ loginCheck }} />
        </Route>
        <Route path="/start">
          <StartPage />
        </Route>
        <Route path="/upload">
          <UploadPhotoPage />
        </Route>
        <Route path="/camera">
          <CameraPage />
        </Route>
      </Switch>

    </Router>
  </Style>;

  // STYLE
  const css = () => /*css*/`
    input {
      display: block;
      width: 300px;
      margin-bottom: 10px;
      line-height: 140%;
    }

    nav a {
      padding: 20px;  
    }

    nav a:first-child {
      padding-left: 0
    }
  `;

  return render();
});