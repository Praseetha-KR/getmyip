#!/usr/bin/env node

var fetch = require('node-fetch');
var program = require('commander');

program
    .version('0.0.1')
    .description('`getmyip` command prints your current IP')
    .usage('[options]')
    .option('-v, --verbose', 'Show more details')
    .parse(process.argv);

const URL = 'http://ipinfo.io';
const OPTIONS = {
    headers: {
        'Accept': 'application/json'
    }
}

function objToStr(obj) {
    var keyval = Object.keys(obj).map(key => `${key}\t: ${obj[key]}`);
    return keyval.join('\n');
}

function ProcessVerboseResponse(response) {
    var res = {
        ip: response.ip,
        host: response.hostname,
        city: response.city, 
        region: response.region,
        country: response.country,
        loc: response.loc,
        org: response.org
    }
    return objToStr(res);
}

fetch(URL, OPTIONS)
    .then(res => res.json())
    .then(response => {
        if(!program.verbose) return response.ip;
        return ProcessVerboseResponse(response);
    })
    .then(text => console.log(text))
    .catch(err => console.log(err));

