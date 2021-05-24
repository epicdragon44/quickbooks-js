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

//TODO FOR RYAN: change from file output to database output. you know what to do lol idk

var data2xml = require('data2xml');
var convert = data2xml({
    xmlHeader: '<?xml version="1.0" encoding="utf-8"?>\n<?qbxml version="13.0"?>\n'
});

/* REROUTE CONSOLE OUTPUT TO A FILE */
const fs = require('fs');
var access = fs.createWriteStream('/root/server/quickbooks-js/node.access.log', { flags: 'a' })
      , error = fs.createWriteStream('/root/server/quickbooks-js/node.error.log', { flags: 'a' });

// redirect stdout / stderr
process.stdout.pipe(access);
process.stderr.pipe(error);

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
	console.log(123213123213554312543812587452187452187452165486325874125374831254875321874317254170);
	var fs = require('fs');
	fs.writeFile('' + __dirname + '/completed/out.txt', response, err => {
  	if (err) {
    		console.error(err);
    		return
  	}
  	//file written successfully
	})
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

    var numOfFiles = 0;

    //count number of xml files
    const length = fs.readdirSync(__dirname).length;
    numOfFiles = length - 2;
    console.log('there are ' + numOfFiles + " xml files available")

    //for each file, read and add to requests
    for (let i = 1; i <= numOfFiles; i++) {
        console.log('iterating on file #' + i);
        addFileToRequest('' + __dirname + '/' + i + '.xml', function(request) {
            console.log('pushed request #' + i);
            requests.push(request);
        }); 
    }

    //wait for requests to populate
    var timeout2 = setInterval(function() {
        if(requests.length === numOfFiles) {
            clearInterval(timeout2);
            console.log('Returning requests and exiting buildFiles');
            return buildcallback(requests);
        }
    }, 100);

    // return Promise.all(requests);
}

function addFileToRequest(path, callback) {
    console.log('entered addFileToRequest. Path: ' + path);

    let request = '';
    //path is something like '' + __dirname + '/1.xml'
    var lineReader = require('line-reader');
    lineReader.eachLine(path, function(line, last) {
        console.log("log: " + line);
        request += line + '\n';
        if (last) {
            console.log('done');
            console.log('Returned: ' + request);
            var fs = require('fs');
            var newPath = '' + __dirname + '/completed' + path.substring(path.indexOf('qbXMLHandler/') + 12, path.length);
            fs.rename(path, newPath, function (err) {
            if (err) throw err
            console.log('Successfully renamed - AKA moved!');
            })
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
