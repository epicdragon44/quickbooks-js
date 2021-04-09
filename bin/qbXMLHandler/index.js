/*
 * This file is part of quickbooks-js
 * https://github.com/RappidDevelopment/quickbooks-js
 *
 * Based on qbws: https://github.com/johnballantyne/qbws
 *
 * (c) 2015 johnballantyne
 * (c) 2016 Rappid Development LLC
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
'use strict';
var data2xml = require('data2xml');
var convert = data2xml({
    xmlHeader: '<?xml version="1.0" encoding="utf-8"?>\n<?qbxml version="13.0"?>\n'
});

var fs = require('fs');

// Public
module.exports = {

    /**
     * Builds an array of qbXML commands
     * to be run by QBWC.
     *
     * @param callback(err, requestArray)
     */
    fetchRequests: function(callback) {
        buildRequests(callback);
    },

    /**
     * Called when a qbXML response
     * is returned from QBWC.
     *
     * @param response - qbXML response
     */
    handleResponse: function(response) {
        console.log("HandleResponse: " + response);
    },

    /**
     * Called when there is an error
     * returned processing qbXML from QBWC.
     *
     * @param error - qbXML error response
     */
    didReceiveError: function(error) {
        console.log("didReceiveError: " + error);
    }
};

function buildRequests(callback) {
    console.log('entered buildRequests');

    buildFiles(function(requests) {
        console.log('done: ' + requests);

        return callback(null, requests);
    });
}

function buildFiles(buildcallback) {
    console.log('entered buildFiles');

    let requests = new Array();

    const numOfFiles = 1;

    for (let i = 1; i <= numOfFiles; i++) {
        console.log('iterating on file #' + i);
        addFileToRequest('' + __dirname + '/' + i + '.xml', function(request) {
            console.log('pushed request #' + i);
            requests.push(request);
        }); 
    }

    var timeout = setInterval(function() {
        if(requests.length === numOfFiles) {
            clearInterval(timeout);
            console.log('Returning requests and exiting buildFiles');
            return buildcallback(requests);
        }
    }, 100);

    // return Promise.all(requests);
}

function addFileToRequest(path, callback) {
    console.log('entered addFileToRequest');

    let request = '';
    //path is something like '' + __dirname + '/1.xml'
    var lineReader = require('line-reader');
    lineReader.eachLine(path, function(line, last) {
        console.log("log: " + line);
        request += line + '\n';
        if (last) {
            console.log('done');
            console.log('Returned: ' + request);
            return callback(request);
        }
    });
}

//example code for buildRequests
// var createCompany = convert(
//     'QBXML',
//     {
//         QBXMLMsgsRq : {
//             _attr : { onError : 'stopOnError' },
//             CustomerAddRq : {
//                 _attr : { requestID : '17' },
//                 CustomerAdd: {
//                     Name: '20706 - Eastern XYZ University1',
//                     CompanyName: 'Eastern XYZ University1',
//                     FirstName: 'Keith1',
//                     LastName: 'Palmer1',
//                     BillAddress: {
//                         Addr1: 'Eastern XYZ University1',
//                         Addr2: 'College of Engineering1',
//                         Addr3: '123 XYZ Road1',
//                         City: 'Storrs-Mansfield1',
//                         State: 'CT',
//                         PostalCode: '06268',
//                         Country: 'United States'
//                     },
//                     Phone: '860-634-1609',
//                     AltPhone: '860-429-0029',
//                     Fax: '860-429-5189',
//                     Email: 'keith1@consolibyte.com',
//                     Contact: 'Keith Palmer1'
//                 }
//             },
//         },
//     }
// );
// requests.push(createCompany);
//end example code