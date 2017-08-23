'use strict';

let schedule = function(time, units) {
    console.log('schedule handler stub');
};

let ranking = function() {
    console.log('ranking handler stub');
};

let listTags = function() {
    console.log('listTags handler stub');
};

let listTasks = function() {
    console.log('listTasks handler stub');
};

let listTypes = function() {
    console.log('listTypes handler stub');
};

let listDomains = function() {
    console.log('listDomains handler stub');
};

let now = function(duration, units) {
    console.log('now handler stub');
};

let inputType = function(typeName) {
    console.log('inputType handler stub');
};

let inputDomain = function(domainName) {
    console.log('inputDomain handler stub');
};

let inputTag = function(tagObj) {
    console.log(tagObj);
    console.log('inputTag handler stub');
};

let inputTask = function(taskObj) {
    console.log('inputTask handler stub');
};

exports.ranking = ranking;
exports.schedule = schedule;
exports.listTags = listTags;
exports.listTasks = listTasks;
exports.listTypes = listTypes;
exports.listDomains = listDomains;
exports.now = now;
exports.inputType = inputType;
exports.inputDomain = inputDomain;
exports.inputTag = inputTag;