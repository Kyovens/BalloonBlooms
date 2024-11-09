const moment = require('moment');

function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment().format('h:mm a')
    };
}

function formatJoinLeave(username, text) {
    return {
        username,
        text
    };
}

function formatRequest(username) {
    return {
        username
    };
}

module.exports = { formatMessage, formatJoinLeave, formatRequest };