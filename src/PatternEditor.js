'use strict';

var PropTypes = require('prop-types');

var React = require('react');
var CodeMirror = require('react-codemirror');
var shallowCompare = require('react-addons-shallow-compare');
require('codemirror/addon/display/placeholder');

var ExpressionHighlighter = require('regexr-site/js/ExpressionHighlighter');
var ExpressionHover = require('regexr-site/js/ExpressionHover');
var RegexUtils = require('./RegexUtils');

var PatternEditor = React.createClass({
  propTypes: {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,

    width: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),  // Defaults to 100%
    height: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ])   // Defaults to auto
  },

  componentDidMount: function() {
    var elem = this._cmElem;

    var cm = elem.getCodeMirror();
    var width = this.props.width || '100%';
    var height = this.props.height || 'auto';
    cm.setSize(width, height);

    // Copied from regexr code:
    // Hacky method to disable overwrite mode on expressions to avoid overwriting flags
    cm.toggleOverwrite = function() {};

    this._cmElem = elem;
    this._expressionHighlighter = new ExpressionHighlighter(cm);
    this._expressionHover = new ExpressionHover(cm, this._expressionHighlighter);

    this.updateCodeMirror(this.props.value);
  },

  updateCodeMirror: function(pattern) {
    var parsed = RegexUtils.parsePattern(pattern);

    this._expressionHighlighter.draw(parsed.tree);
    this._expressionHover.token = parsed.token;
  },

  componentDidUpdate: function() {
    this.updateCodeMirror(this.props.value);
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },

  render: function() {
    var value = this.props.value;

    return (
      <CodeMirror
          className="regexr regexr-expression-editor"
          value={value}
          onChange={this.props.onChange}
          options={{
            lineNumbers: false,
            tabSize: 2,
            indentWithTabs: false,
            placeholder: '(Type a regular expression)',
            lineWrapping: true
          }}
          ref={function(elem) { this._cmElem = elem; }.bind(this)} />
    );
  },
});

module.exports = PatternEditor;
