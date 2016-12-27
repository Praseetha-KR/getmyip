#!/usr/bin/env node

const fetch = require('node-fetch');
const program = require('commander');
const pkg = require('./package.json');

const URL = 'http://ipinfo.io';
const OPTIONS = {
    headers: {
        'Accept': 'application/json'
    }
};

function ProcessVerboseResponse(response) {
    const res = {
        ip: response.ip,
        host: response.hostname,
        city: response.city,
        region: response.region,
        country: response.country,
        loc: response.loc,
        org: response.org
    };
    return objToStr(res);
}

function objToStr(obj) {
    const keyval = Object.keys(obj).map(key => `${key}\t: ${obj[key]}`);
    return keyval.join('\n');
}

program
    .version(pkg.version)
    .description('`getmyip` command prints your current IP')
    .usage('[options]')
    .option('-v, --verbose', 'Show more details')
    .parse(process.argv);

fetch(URL, OPTIONS)
    .then(res => res.json())
    .then(response => {
        if(!program.verbose) return response.ip;
        return ProcessVerboseResponse(response);
    })
    .then(text => console.log(text))
    .catch(err => console.log(err));
