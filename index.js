#!/usr/bin/env node

const https = require('https');
const program = require('commander');
const pkg = require('./package.json');

const URL = 'https://1.1.1.1/cdn-cgi/trace';

function ProcessVerboseResponse(response) {
    const properties = response.split('\n');
    const data = properties.reduce((obj, item) => {
        var itemsplit = item.split('=');
        itemsplit[0] && (obj[itemsplit[0]] = itemsplit[1]);
        return obj;
    }, {});
    return data;
}

function promisifyResponseData(res) {
    return new Promise((resolve) => {
        var data = [];
        res.setEncoding('utf8');
        res.on('data', d => {
            data.push(d);
        });
        res.on('end', () => {
            resolve(data.join(''));
        });
    });
}


program
    .version(pkg.version)
    .description('`getmyip` command prints your current IP')
    .usage('[options]')
    .parse(process.argv);


https.get(URL, (res) => {
    promisifyResponseData(res)
        .then(text => ProcessVerboseResponse(text))
        .then(ipObj => console.log(ipObj.ip))
        .catch(err => console.log(err));
});
