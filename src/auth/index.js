/* global AUTH0_DOMAIN AUTH0_CLIENT_ID */
import auth0 from 'auth0-js';
import { navigateTo } from 'gatsby-link';

console.log(AUTH0_DOMAIN, AUTH0_CLIENT_ID);
class Auth {
  constructor() {
    this.auth0 = new auth0.WebAuth({
      domain: AUTH0_DOMAIN,
      clientID: AUTH0_CLIENT_ID,
      redirectUri: 'http://localhost:8000/auth-callback',
      audience: `https://${AUTH0_DOMAIN}/api/v2/`,
      responseType: 'token id_token',
      scope: 'openid profile email'
    });

    this.getUser = this.getUser.bind(this);
    this.getToken = this.getToken.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.setSession = this.setSession.bind(this);
  }

  login() {
    return this.auth0.authorize();
  }

  logout() {
    return Promise.all([
      localStorage.removeItem('access_token'),
      localStorage.removeItem('id_token'),
      localStorage.removeItem('expires_at'),
      localStorage.removeItem('user')
    ]);
  }

  handleAuthentication() {
    if (typeof window !== 'undefined') {
      this.auth0.parseHash((err, authResult) => {
        if (err) {
          console.log(err);
          return navigateTo('/strange-place');
        }
        if (authResult && authResult.accessToken && authResult.idToken) {
          return this.setSession(authResult).then(() => navigateTo('/'));
        }
        return navigateTo('/strange-place');
      });
    }
  }

  isAuthenticated() {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    const isAuth = new Date().getTime() < expiresAt;
    if (!isAuth) {
      this.logout();
    }
    return isAuth;
  }

  setSession = authResult => {
    const expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );
    const userInfo = new Promise((resolve, reject) => {
      this.auth0.client.userInfo(authResult.accessToken, (err, user) => {
        if (err) {
          // TODO: Decide what we want to do here
          reject(err);
        }
        console.log(user);
        localStorage.setItem('user', JSON.stringify(user));
        resolve();
      });
    });
    return Promise.all([
      userInfo,
      localStorage.setItem('access_token', authResult.accessToken),
      localStorage.setItem('id_token', authResult.idToken),
      localStorage.setItem('expires_at', expiresAt)
    ]);
  };

  getUser() {
    const user = this.isAuthenticated() && localStorage.getItem('user');
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }

  getToken() {
    return localStorage.getItem('id_token');
  }
}

export default new Auth();
