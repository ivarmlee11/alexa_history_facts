/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("alexa-verifier");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("request");

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _express = __webpack_require__(2);

var _express2 = _interopRequireDefault(_express);

var _bodyParser = __webpack_require__(1);

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _alexaVerifier = __webpack_require__(0);

var _alexaVerifier2 = _interopRequireDefault(_alexaVerifier);

var _http = __webpack_require__(3);

var _http2 = _interopRequireDefault(_http);

var _request = __webpack_require__(4);

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var PORT = process.env.PORT || 3000;

app.use(_bodyParser2.default.json({
  verify: function getRawBody(req, res, buf) {
    req.rawBody = buf.toString();
  }
}));

app.post('/thisdayinhistory', requestVerifier, function (req, res) {

  if (req.body.request.type === 'LaunchRequest') {

    res.json({
      "version": "1.0",
      "response": {
        "shouldEndSession": true,
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak> I'm digging into my historical data banks </speak>"
        }
      }
    });
  } else if (req.body.request.type === 'SessionEndedRequest') {
    // no response sent for this request.type
    console.log('Alexa session ended ' + req.body.request.reason);
  } else if (req.body.request.type === 'IntentRequest' && req.body.request.intent.name === 'ThisDayInHistory') {

    if (res.statusCode === 200) {

      (0, _request2.default)('http://history.muffinlabs.com/date', function (error, response, body) {
        var data = JSON.parse(body);
        var eventsArray = data.data.Events;
        var date = data.date;
        var randomEvent = Math.floor(Math.random() * (eventsArray.length - 1));
        var choice = eventsArray[randomEvent];
        var alexaSpeachResponse = '<speak> On ' + date + ' in ' + choice.year + ', ' + choice.text + ' </speak>';

        res.json({
          "version": "1.0",
          "response": {
            "shouldEndSession": true,
            "outputSpeech": {
              "type": "SSML",
              "ssml": alexaSpeachResponse
            }
          }
        });
      });
    }
  } else {

    res.json({
      "version": "1.0",
      "response": {
        "shouldEndSession": true,
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak> I am not sure what is going on. </speak>"
        }
      }
    });
  }
});

function requestVerifier(req, res, next) {

  (0, _alexaVerifier2.default)(req.headers.signaturecertchainurl, req.headers.signature, req.rawBody, function (err) {
    if (err) {
      throw new Error();
    } else {
      next();
    }
  });
}

setInterval(function () {
  console.log('KEEPING HEROKU AWAKE');
  _http2.default.get('http://alexathisdayinhistory.herokuapp.com');
}, 400000);

app.listen(PORT, function () {
  console.log('listening on... ' + PORT);
});

/***/ })
/******/ ]);