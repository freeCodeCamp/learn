import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import auth from '../auth';
import { updateUserSignedIn } from '../redux/app';

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ updateUserSignedIn }, dispatch);

function AuthCallback({ updateUserSignedIn }) {
  auth.handleAuthentication().then(() => {
    updateUserSignedIn(auth.isAuthenticated());
  });
  return <h2>One moment whilst we finish signing you in</h2>;
}

AuthCallback.displayName = 'AuthCallback';

export default connect(mapStateToProps, mapDispatchToProps)(AuthCallback);
