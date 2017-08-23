'use strict';

const util = require('./services/util');
const program = require('commander');
const handlers = require('./handlers');
const validation = require('./services/validation');
const constants = require('./constants');
const output = require('./services/output');
const prompts = require('./services/prompts');

function getDefaultDomain() {
    return 'DEFAULT';
}

function errorCallback(error) {
    output.simpleErrorMessage(error);
}

/* Options */

program.option('-D, --domain <domain>', 'set the domain');

/* Commands */

//ranking
program.command('ranking')
.description('outputs a comprehensive and ordered task list')
.action(() => {
    handlers.ranking();
});

//schedule
program.command('schedule')
.description('Outputs a time ordered schedule for an input amount of total time.'  + 
    'Can specify whether time is in minutes or hours' + 
    'Time defaults to 8 hours')
.action((time, units) => {
    time = validation.convertNumber(time, constants.DEFAULT_SCHEDULE_TIME);
    units = validation.convertUnits(units, constants.DEFAULT_SCHEDULE_UNITS);
    handlers.schedule(time, units)
});

//listTags
program.command('listTags')
.description('Lists tags with a ranking weight, ordered by ranking weight')
.action(() => {
    handlers.listTags();
});

//listTasks
program.command('listTasks [tagNames...]')
.description('Lists tasks grouped by type, ordered by frequency, with times and tags listed. Can filter by input tag names')
.action((tagNames) => {
    tagNames = validation.trimTags(tagNames);
    handlers.listTasks(tagNames)
});

//listTypes
program.command('listTypes')
.description('Lists Types')
.action(() => {
    handlers.listTypes();
});

//listDomains
program.command('listDomains')
.description('Lists Domains with Tasks and Types available for each. The default is highlighted.')
.action(() => {
    handlers.listDomains();
})

//now
program.command('now')
.description('Outputs a task to work on now. Can optionally include a duration and, additionally optionally, a unit for that duration')
.action((duration, units) => {
    duration = validation.convertNumber(duration, constants.DEFAULT_NOW_TIME);
    units = validation.convertUnits(duration, constants.DEFAULT_NOW_UNITS);
    handlers.now(duration, units);
});

//inputType
program.command('inputType')
.description('Input a new type with a typeName. Will ask for typeName if not supplied')
.option('-t, --typeName <typeName>', 'inputs a name for the type')
.action((options) => {
    if(typeof options.typeName === 'undefined') {
        output.promptForEntry('Give the Type a name', validation.isLegalName)
        .then((typeName) => {
            handlers.inputType(typeName);
        }).catch(errorCallback);
    } else {
        if(validation.isLegalName(options.typeName)) {
            handlers.inputType(options.typeName);
        }
    }
});

//inputDomain
program.command('inputDomain')
.description('Input a new domain with a domainName. Will ask for domainName if not supplied.')
.option('-d, --domainName <domainName>', 'inputs a domainName for the new domain')
.action((options) => {
    if(typeof options.domainName === 'undefined') {
        prompts.promptForEntry('Give the Domain a name', validation.isLegalName)
        .then((domainName) => {
            handlers.inputDomain(domainName);
        }).catch(errorCallback);
    } else {
        if(validation.isLegalName(options.domainName)) {
            handlers.inputDomain(options.domainName);
        }
    }
});

/**
 * General purpose handling function for appropriately getting needed user input
 * @param {*String} objName 
 * @param {*Function} handlerFn 
 * @param {*Object} opts 
 */
async function promptAndHandleMultipleInputs(objName, handlerFn, opts) {
    try {
        let obj = {};
        for (let index = 0; index < opts.length; index++) {
            console.log('obj', obj);
            let prop = opts[index];
            if(typeof prop.value === 'undefined') {
                let shouldClose = (index === opts.length - 1);
                prop.value = await prompts.promptForEntry('Give the ' + objName + ' a ' + prop.propName + ': ', prop.validationFn, shouldClose);
            } else {
                if(!prop.validationFn(prop.value)) {
                    throw '"' + prop.value + '" is not a valid ' + prop.propName + ' for a ' + objName;
                } 
            }
            if(prop.transformationFn) {
                prop.value = prop.transformationFn(prop.value);
            }
            obj[prop.propName] = prop.value;
        }
        handlerFn(obj);      
    } catch (errStr) {
        errorCallback(errStr);
    }
}

//inputTag
program.command('inputTag')
.description('Input a new tag with a tagName, weight. Will ask for both if not supplied')
.option('-t, --tagName <tagName>', 'inputs a name for a tag')
.option('-w, --weight <weight>', 'inputs a weight for a tag')
.action((options) => {
    let promptOptions = [{
        propName: 'name',
        value: options.tagName,
        validationFn: validation.isLegalName
    },{
        propName: 'weight',
        value: options.weight,
        validationFn: validation.isLegalWeight,
        transformationFn: validation.convertNumber
    }];
    promptAndHandleMultipleInputs('Tag', handlers.inputTag, promptOptions);
});

//inputTask
program.command('inputTask')
.description('Input a new task with a taskName, a frequency, a minTime, a maxTime, and a list of Tags. Any missing information will be queried')
.option('-t, --taskName <taskName>', 'inputs a name for a task')
.option('-f, --frequency <frequency>', 'inputs a frequency for a tag')
.option('-m, --minTime <minTime>', 'inputs a minimum time needed for a task. Expects minutes')
.option('-M, --maxTime <maxTime>', 'inputs a maximum time needed for a task. Expects minutes')
.option('-T --tags <tags>', 'inputs a comma separated list of tags to include. Unrecognized tags are ignored.')
.action((options) => {
    let promptOptions = [{
        propName: 'name',
        value: options.taskName,
        validationFn: validation.isLegalName
    }, {
        propName: 'frequency',
        value: options.frequency,
        validationFn: validation.isLegalFrequency,
        transformationFn: validation.convertNumber
    }, {
        propName: 'minTime',
        value: options.minTime,
        validationFn: validation.isLegalTime,
        transformationFn: validation.convertNumber
    }, {
        propName: 'maxTime',
        value: options.maxTime,
        validationFn: validation.isLegalTime,
        transformationFn: validationFn.convertNumber
    }, {
        propName: 'tags',
        value: options.tags,
        validationFn: validation.isCommaSeparatedList,
        transformationFn: validation.getTagsFromStr
    }];
});

//editTask
program.command('editTask')
.description('Edit a task using a taskName. Can input a new taskName, frequency, minTime, or maxTime. ' + 
    'Can also addTag, removeTag, or set newTags' )
.option('-n, --newTaskName <newTaskName>', 'input a new task name')
.option('-f, --frequency <frequency>', 'input the desired new frequency for the task')
.option('-m, --minTime <minTime>', 'input the new minimum time for the task')
.option('-M, --maxTime <maxTime>', 'input the new maximum time for the task')
.option('-a, --addTag <newTag>', 'adds a new tag to the task')
.option('-r, --removeTag <removedTag>', 'removes a tag, if present, from the task')
.option('-t, --newTags <newTags>', 'replaces the set of tags for a given task with newTags. Overrides addTag and removeTag options')
.action((taskName, options) => {
    console.log('editTask stub');
});

//editTag
program.command('editTag')
.description('Edit a tag using a tagName. Can input a new tagName and weight')
.option('-n, --newTagName <newTagName>', 'input a new tag name')
.option('-w, --weight <weight>', 'input the desired new weight for the tag')
.action((tagName, options) => {
    console.log('editTag stub');
})

//editType
program.command('editType')
.description('Edit a type using a typeName. Can input a new typeName')
.option('-n, --newTypeName <newTypeName>', 'inputs a new type name')
.action((typeName, options) => {
    console.log('editType stub');
});

//editDomain
program.command('editDomain')
.description('Edit a domain using a domainName. Can input a new domainName')
.option('-n, --newDomainName <newDomainName>', 'inputs a new domain name')
.action((domainName, options) => {
    console.log('editDomain stub');
});

//setDefaultDomain
program.command('setDefaultDomain')
.description('Sets the default domain to the input domainName')
.action((domainName) => {
    console.log('setDefaultDomain stub');
});

//getDefaultDomain
program.command('getDefaultDomain')
.description('Gets the default domain and prints its name with associated Tasks and Types.')
.action(() => {
    console.log('getDefaultDomain stub');
})

let args = program.parse(process.argv).args;

//set domain
if(!program.domain) {
    //set domain
    program.domain = getDefaultDomain();
}

//default and unknown input handling
if(util.empty(args)) {
    //default handling - same as empty 'schedule' command
    console.log('default');
} else if(util.noCommand(args)) {
    //default unrecognized input handling
    console.log('unrecognized input');
}