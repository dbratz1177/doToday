'use strict';

let getTags = function(tagNames) {
    console.log('Tags api getTags stub');
    let possibleTagNames = new Array(...tagNames);
    possibleTagNames.splice(0, 1);
    return possibleTagNames.map((name) => {
        return {name: name};
    });
};

exports.getTags = getTags;