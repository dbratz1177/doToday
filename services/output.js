'use strict';

const colors = require('colors');

let simpleErrorMessage = function(message) {
    let errMsg = 'ERROR: ' + message;
    console.log(errMsg.red.bold);
};

let crazySimpleErrorMessage = function(message) {
    let errMsg = 'ERROR: ' + message;
    console.log(errMsg.rainbow);
};

let outputWarningForList = function(strList, warning) {
    for (var index = 0; index < strList.length; index++) {
        let msg = strList[index] + warning;
        console.log(msg.bgYellow);
    }
};

exports.simpleErrorMessage = simpleErrorMessage;
exports.crazySimpleErrorMessage = crazySimpleErrorMessage;
exports.outputWarningForList = outputWarningForList;