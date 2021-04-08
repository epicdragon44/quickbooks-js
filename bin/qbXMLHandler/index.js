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

var fs = require('fs'),
path = require('path'),
xmlReader = require('read-xml');

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
        console.log(response);
    },

    /**
     * Called when there is an error
     * returned processing qbXML from QBWC.
     *
     * @param error - qbXML error response
     */
    didReceiveError: function(error) {
        console.log(error);
    }
};

function buildRequests(callback) {
    var requests = new Array();

    //example code
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

    var FILE = path.join(__dirname, 'RequestXML/1.xml');
    var requestxml = '';
 
    // pass a buffer or a path to a xml file
    xmlReader.readXML(fs.readFileSync(FILE), function(err, data) {
        if (err) { console.error(err); }
        console.log('DATA CONTENT BELOW ============')
        console.log(data.content);
        console.log('END DATA CONTENT   ============')
        requestxml = data.content;
    });

    requests.push(requestxml);

    return callback(null, requests);
}