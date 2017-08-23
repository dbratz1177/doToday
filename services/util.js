'use strict';

//Prototype alteration
//Set
Set.prototype.difference = function(setB) {
    var difference = new Set(this);
    for(var elem of setB) {
        difference.delete(elem); 
    }
    return difference;
}

//helper functions

let empty = function (args) {
    return args.length === 0;
};

let noCommand = function (args) {
    for (var index = 0; index < args.length; index++) {
        if(typeof args[index] === 'object') {
            //then, by commander api, one of the args is a command
            return false;
        }
    }
    return true;
};

let strictParseInt = function(value) {
  if (/^(\-|\+)?([0-9]+|Infinity)$/.test(value))
    return Number(value);
  return NaN;
};


exports.empty = empty;
exports.noCommand = noCommand;
exports.strictParseInt = strictParseInt;