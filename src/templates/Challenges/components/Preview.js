import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './preview.css';

const mainId = 'fcc-main-frame';

const propTypes = {
  className: PropTypes.string,
  disableIframe: PropTypes.bool
};

class Preview extends PureComponent {
  constructor(...props) {
    super(...props)

    this.state = {
      iframeStatus: this.props.disableIframe
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.disableIframe !== nextProps.disableIframe) {
      this.setState({ iframeStatus: !this.state.iframeStatus })
    }
  }

  render() {
    const iframeToggle = this.state.iframeStatus ? 'disable' : 'enable';
    return (
      <div className={`challenge-preview ${iframeToggle}-iframe`}>
        <iframe className={'challenge-preview-frame'} id={mainId} />
      </div>
    );
  }
}

Preview.displayName = 'Preview';
Preview.propTypes = propTypes;

export default Preview;
