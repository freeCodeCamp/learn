import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Panel from 'react-bootstrap/lib/Panel';

import './strange-place.css';
import { allAppDataSelector } from '../redux/app';

const mapStateToProps = createSelector(allAppDataSelector, state => ({
  state
}));

const propTypes = {};

function StrangePlace() {
  return (
    <div className='strange-place-container'>
      <Panel bsStyle='primary'>
        <Panel.Heading>
          <Panel.Title componentClass='h3'>Whoops!</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <p>Something really weird happend and we are not sure what.</p>
          <hr />
          <p>
            Could you help us fix this by supplying annonymous application data
            for us to look over?
          </p>
          <p>We can show you exactly what we would like to send</p>
        </Panel.Body>
      </Panel>
    </div>
  );
}

StrangePlace.displayName = 'StrangePlace';
StrangePlace.propTypes = propTypes;

export default connect(mapStateToProps)(StrangePlace);
