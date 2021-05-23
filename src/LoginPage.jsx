import React from 'react';
import { useHistory } from "react-router-dom";
import { Style, useStates } from 'react-easier';
import mongoosy from 'mongoosy/frontend';
const { Login } = mongoosy;

export default function LoginPage({ loginCheck }) {
  // LOGIC

  const s = useStates({
    email: '',
    password: '',
    error: ''
  });

  const history = useHistory();

  const login = async e => {
    e.preventDefault();
    let { email, password } = s;
    // try to login
    let result = await Login.login({ email, password });
    if (result.js.error) { s.error = 'Login failed'; return; }
    // update login info
    loginCheck();
    // redirect to the start page
    history.push('/');
  };

  // TEMPLATE
  const render = () => <Style css={css()}>
    <h1>Log in</h1>
    <form onSubmit={login}>
      <input type="email" placeholder="Email"
        required {...s.bind('email')} />
      <input type="password" placeholder="Password"
        required minLength="6"{...s.bind('password')} />
      {s.error && <p>{s.error}</p>}
      <input type="submit" value="Log in" />
    </form>
  </Style>;

  // STYLE
  const css = () => /*css*/`
  `;

  return render();
}