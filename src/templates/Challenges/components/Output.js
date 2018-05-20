import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import MonacoEditor from 'react-monaco-editor';

const propTypes = {
  defaultOutput: PropTypes.string,
  height: PropTypes.number,
  output: PropTypes.string
};

const options = {
  lineNumbers: false,
  minimap: {
    enabled: false
  },
  readOnly: true,
  scrollbar: {
    vertical: 'hidden',
    horizontal: 'hidden'
  },
  wordWrap: 'on'
};

class Output extends PureComponent {
  constructor(...props) {
    super();

    this._editor = null;
  }

  componentDidMount() {
    window.addEventListener("resize", this.resizeOutput);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeOutput);
  }

  editorDidMount(editor, monaco) {
    this._editor = editor;
  }

  resizeOutput = () => this._editor.layout();

  render() {
    const { output, defaultOutput, height } = this.props;
    return (
      <Fragment>
        <base href='/' />
        <MonacoEditor
          className='challenge-output'
          height={height}
          options={options}
          value={output ? output : defaultOutput}
          editorDidMount={::this.editorDidMount}
        />
      </Fragment>
    );
  }
}

Output.displayName = 'Output';
Output.propTypes = propTypes;

export default Output;
