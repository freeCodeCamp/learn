import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Button } from 'react-bootstrap';

import './tool-panel.css';
import { openModal, executeChallenge } from '../redux';

const mapStateToProps = () => ({});
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      executeChallenge,
      openHelpModal: () => openModal('help'),
      openResetModal: () => openModal('reset')
    },
    dispatch
  );

const propTypes = {
  executeChallenge: PropTypes.func.isRequired,
  guideUrl: PropTypes.string,
  openHelpModal: PropTypes.func.isRequired,
  openResetModal: PropTypes.func.isRequired
};

function ToolPanel({
  executeChallenge,
  openHelpModal,
  openResetModal,
  guideUrl
}) {
  return (
    <Fragment>
      <div className='tool-panel-group'>
        <Button block={true} bsStyle='primary' onClick={executeChallenge}>
          Run the Tests
        </Button>
        <Button
          block={true}
          bsStyle='primary'
          className='btn-primary-invert'
          onClick={openResetModal}
          >
          Reset All Code
        </Button>
        {guideUrl ? (
          <Button
            block={true}
            bsStyle='primary'
            className='btn-primary-invert'
            href={guideUrl}
            target='_blank'
            >
            Get a hint
          </Button>
        ) : null}
        <Button
          block={true}
          bsStyle='primary'
          className='btn-primary-invert'
          onClick={openHelpModal}
          >
          Ask for help
        </Button>
      </div>
    </Fragment>
  );
}

ToolPanel.displayName = 'ToolPanel';
ToolPanel.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(ToolPanel);

/*
<Button
        block={true}
        bsStyle='default'
        className='btn-big'
        onClick={executeChallenge}
        >
        Run tests (Ctrl + Enter)
      </Button>
      <div className='button-spacer' />
      <Button
        block={true}
        bsStyle='default'
        className='btn-big'
        onClick={openResetModal}
        >
        Reset this lesson
      </Button>
      <div className='button-spacer' />
      {guideUrl && (
        <div>
          <Button
            block={true}
            bsStyle='default'
            className='btn-big'
            href={guideUrl}
            target='_blank'
            >
            Get a hint
          </Button>
          <div className='button-spacer' />
        </div>
      )}
      <Button
        block={true}
        bsStyle='default'
        className='btn-big'
        onClick={openHelpModal}
        >
        Ask for help on the forum
      </Button>
      <div className='button-spacer' />
*/
