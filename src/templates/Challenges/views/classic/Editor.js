import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MonacoEditor from 'react-monaco-editor';

import { executeChallenge, updateFile } from '../../redux';

const propTypes = {
  contents: PropTypes.string,
  executeChallenge: PropTypes.func.isRequired,
  ext: PropTypes.string,
  fileKey: PropTypes.string,
  updateFile: PropTypes.func.isRequired
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      executeChallenge,
      updateFile
    },
    dispatch
  );

const modeMap = {
  css: 'css',
  html: 'html',
  js: 'javascript',
  jsx: 'javascript'
};

class Editor extends PureComponent {
  constructor(...props) {
    super(...props);
    this.options = {
      selectOnLineNumbers: true
    };
    this._editor = null;

    this.focusEditor = this.focusEditor.bind(this);
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.focusEditor);
  }

  editorDidMount(editor, monaco) {
    this._editor = editor;
    document.addEventListener('keyup', this.focusEditor);
    this._editor.addAction({
      id: 'execute-challenge',
      label: 'Run tests',
      keybindings: [
        /* eslint-disable no-bitwise */
        monaco.KeyMod.chord(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter)
      ],
      run: this.props.executeChallenge
    });
  }

  focusEditor(e) {
    // e key to focus editor
    if (e.keyCode === 69) {
      console.log('focusing');
      this._editor.focus();
    }
  }

  onChange(editorValue) {
    const { updateFile, fileKey } = this.props;
    updateFile({ key: fileKey, editorValue });
  }

  render() {
    const { contents, ext } = this.props;

    return (
      <div className='classic-editor editor'>
        <base href='/' />
        <MonacoEditor
          editorDidMount={::this.editorDidMount}
          language={modeMap[ext]}
          onChange={::this.onChange}
          options={this.options}
          theme='vs-dark'
          value={contents}
        />
      </div>
    );
  }
}

Editor.displayName = 'Editor';
Editor.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(Editor);

/*
 <CodeMirror
    onBeforeChange={(editor, something, newValue) =>
      this.handleChange(newValue)
    }
    options={{
      mode: modeMap[ext],
      theme: 'material',
      lineNumbers: true,
      lineWrapping: true,
      extraKeys: {
        Esc() {
          document.activeElement.blur();
        },
        Tab(cm) {
          if (cm.somethingSelected()) {
            return cm.indentSelection('add');
          }
          const spaces = Array(cm.getOption('indentUnit') + 1).join(' ');
          return cm.replaceSelection(spaces);
        },
        'Shift-Tab': function(cm) {
          return cm.indentSelection('subtract');
        },
        'Ctrl-Enter': function() {
          executeChallenge();
          return false;
        },
        'Cmd-Enter': function() {
          executeChallenge();
          return false;
        }
        // TODO: Not working in cm2
        // 'Ctrl-/': function(cm) {
        //   cm.toggleComment();
        // },
        // 'Cmd-/': function(cm) {
        //   cm.toggleComment();
        // }
      }
    }}
    value={contents}
  />
*/
