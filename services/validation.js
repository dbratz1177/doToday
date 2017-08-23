'use strict';

let output = require('./output');
let util = require('./util');
let tagAPI = require('../models/tags/api');
let constants = require('../constants');

/*
    expects inputNum to be a string, attempts to convert
    to number, if unsuccessful, then outputs error and gives default.
    Also just yields default if null or undefined
 */
let convertNumber = function(inputNum, defaultNum) {
    if(inputNum == null) {
        return defaultNum;
    }
    let convertedNum = util.strictParseInt(inputNum);
    if(isNaN(convertedNum)) {
        output.simpleErrorMessage(inputNum + ' is not parseable to a number');
        return defaultNum;
    }
    return convertedNum;
};

/*
    attempts to normalize inputUnits. Yields default if null, 
    undefined, or unparseable.
    Outputs error if unparseable
 */
let convertUnits = function(inputUnits, defaultUnits) {
    if(inputUnits == null) {
        return defaultUnits;
    }
    switch (inputUnits) {
        case 'h':
        case 'hr':
        case 'hrs':
        case 'hour':
        case 'hours':
            inputUnits = 'h';
            break;
    
        case 'm':
        case 'min':
        case 'mins':
        case 'minute':
        case 'minutes':
            inputUnits = 'm';
            break;

        default:
            output.crazySimpleErrorMessage(inputUnits + ' is not a recognized time unit');
            inputUnits = defaultUnits;
            break;
    }
    return inputUnits;
};

/*
    returns a list of tags, trimmed by which actual tags are in use.
    messages will be shown for tags that are not included
*/
let trimTags = function(inputTagNames) {
    if(inputTagNames.length > 0) {
        let trimmedTagNames = new Set(tagAPI.getTags(inputTagNames).map(tag => tag.name));
        inputTagNames = new Set(inputTagNames);
        let missingNames = inputTagNames.difference(trimmedTagNames);
        output.outputWarningForList([...missingNames], ': this is not an existing Tag name.');
        return [...trimmedTagNames];
    }
    return inputTagNames;
};

/**
 * checks whether, syntactically, a name is legal. If not, will also log explanatory errors.
 * Currently pretty lenient
 */
let isLegalName = function(name) {
    name = name.trim();
    if(!name) {
        output.crazySimpleErrorMessage('"' + name + '" is not a legal name');
        return false;
    }
    return true;
};

/**
 * Checks whether a weight is legal. If not, will also log explanatory errors.
 */
let isLegalWeight = function(weight) {
    weight = weight.trim();
    if(!weight) {
        output.crazySimpleErrorMessage("You need to input a weight");
        return false;
    }
    let parsedWeight = util.strictParseInt(weight);
    if(isNaN(parsedWeight)) {
        output.crazySimpleErrorMessage('"' + weight + '" is not an integer');
        return false;
    }
    if(parsedWeight < constants.MIN_WEIGHT) {
        output.crazySimpleErrorMessage('Sorry boss. "' + weight + '" is less than the minimum: ' + constants.MIN_WEIGHT);
        return false;
    }
    if(parsedWeight > constants.MAX_WEIGHT) {
        output.crazySimpleErrorMessage('Sorry boss. "' + weight + '" is greater than the maximum: ' + constants.MAX_WEIGHT);
        return false;
    }
    return true;
};

/**
 * Checks whether a frequency is legal
 */
let isLegalFrequency = function(frequency) {
    frequency = frequency.trim();
    if(!frequency) {
        output.crazySimpleErrorMessage("You need to input a frequency");
        return false;
    }
    let parsedFrequency = util.strictParseInt(frequency);
    if(isNaN(parsedFrequency)) {
        output.crazySimpleErrorMessage('"' + frequency + '" is not an integer');
        return false;
    }
    if(parsedFrequency < constants.MIN_FREQUENCY) {
        output.crazySimpleErrorMessage('Sorry boss. "' + frequency + '" is less than the minimum: ' + constants.MIN_FREQUENCY);
        return false;
    }
    if(parsedFrequency > constants.MAX_FREQUENCY) {
        output.crazySimpleErrorMessage('Sorry boss. "' + frequency + '" is greater than the maximum: ' + constants.MAX_FREQUENCY);
        return false;
    }
    return true;
};

/**
 * Checks whether a time is legal
 */
let isLegalTime = function(time) {
    time = time.trim();
    if(!time) {
        output.crazySimpleErrorMessage("You need to input a time");
        return false;
    }
    let parsedTime = util.strictParseInt(time);
    if(isNaN(parsedTime)) {
        output.crazySimpleErrorMessage('"' + time + '" is not an integer');
        return false;
    }
    if(parsedTime < 0) {
        output.crazySimpleErrorMessage("Sorry boss. We don't deal with negative times");
        return false;
    }
    return true;
};

/**
 * Checks whether the input is a valid comma separated list
 */
let isCommaSeparatedList = function(str) {
    console.log('isCommaSeparatedList stub');
    //use regex to look for comma at (trimmed) beginning, end.
    //also look for two in a row
    /* /,,|,$|^,/ */
};

/**
 * returns an a array from a comma separated string list
 */
let getTagsFromStr = function(str) {
    console.log('getTagsFromStr stub');
};

exports.convertNumber = convertNumber;
exports.convertUnits = convertUnits;
exports.trimTags = trimTags;
exports.isLegalName = isLegalName;
exports.isLegalWeight = isLegalWeight;
exports.isLegalFrequency = isLegalFrequency;
exports.isLegalTime = isLegalTime;
exports.isCommaSeparatedList = isCommaSeparatedList;
exports.getTagsFromStr = getTagsFromStr;