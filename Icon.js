"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = require("styled-components");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var IconWrapper = _styledComponents2.default.span.withConfig({
  displayName: "Icon__IconWrapper",
  componentId: "sc-1qqey2j-0"
})(["display:flex;color:", ";font-size:", ";svg{path,ellipse,circle,rect{fill:currentColor;}}"], function (_ref) {
  var theme = _ref.theme,
      iconColor = _ref.iconColor;
  return theme.iconColors[iconColor];
}, function (_ref2) {
  var theme = _ref2.theme,
      size = _ref2.size;
  return theme.iconSizes[size];
});

var ScreenReaderOnly = _styledComponents2.default.span.withConfig({
  displayName: "Icon__ScreenReaderOnly",
  componentId: "sc-1qqey2j-1"
})(["border:0;clip:rect(0 0 0 0);clip-path:inset(50%);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px;"]);

var Icon =
/*#__PURE__*/
function (_Component) {
  _inherits(Icon, _Component);

  function Icon() {
    _classCallCheck(this, Icon);

    return _possibleConstructorReturn(this, _getPrototypeOf(Icon).apply(this, arguments));
  }

  _createClass(Icon, [{
    key: "render",
    value: function render() {
      return _react2.default.createElement(IconWrapper, {
        "data-key": "icon-".concat(this.name),
        iconColor: this.props.color,
        size: this.props.size,
        className: this.props.className
      }, this.icon, this.props.title && _react2.default.createElement(ScreenReaderOnly, null, this.props.title));
    }
  }]);

  return Icon;
}(_react.Component);

Icon.propTypes = {
  size: _propTypes2.default.string,
  color: _propTypes2.default.string,
  title: _propTypes2.default.string,
  className: _propTypes2.default.string
};
Icon.defaultProps = {
  size: 'sm',
  color: 'brand01'
};
exports.default = Icon;