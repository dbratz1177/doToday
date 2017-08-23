'use strict';

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let promptForEntry = function(promptText, entryValidationFn, close) {
    return new Promise((resolve, reject) => {
        rl.question(promptText, function(answer) {
            if(!close)
                rl.pause();
            else
                rl.close();
            if(!entryValidationFn(answer)) {
                reject('"' + answer + '" is not a valid entry');
            }
            resolve(answer);
        });
    });
};

exports.promptForEntry = promptForEntry;