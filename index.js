#!/usr/bin/env node

const fetch = require('node-fetch');
const program = require('commander');
const pkg = require('./package.json');

const URL = 'https://1.1.1.1/cdn-cgi/trace';
const OPTIONS = {
    headers: {
        'Accept': 'application/json'
    }
};

function ProcessVerboseResponse(response) {
    const properties = response.split('\n');
    const data = properties.reduce((obj, item) => {
        var itemsplit = item.split('=');
        itemsplit[0] && (obj[itemsplit[0]] = itemsplit[1]);
        return obj;
    }, {});
    return data;
}

program
    .version(pkg.version)
    .description('`getmyip` command prints your current IP')
    .usage('[options]')
    .parse(process.argv);

fetch(URL, OPTIONS)
    .then(res => res.text())
    .then(response => {
        const processdata = ProcessVerboseResponse(response);
        return processdata.ip;
    })
    .then(text => console.log(text))
    .catch(err => console.log(err));
