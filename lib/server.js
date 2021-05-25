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

/*
 * Server.js
 *
 * This class will star the SOAP service
 * and start listening for requests from
 * a Quickbooks Web Connector
 */

//////////////////
//
// Private
//
//////////////////

/**
 * Node.js' HTTP Library
 *
 * https://nodejs.org/dist/latest-v6.x/docs/api/http.html
 */
var http = require('http');

/**
 * Node.js' File System API
 *
 * https://nodejs.org/dist/latest-v6.x/docs/api/fs.html
 */
var fs = require('fs');

/**
 * A SOAP client and server
 * for Node.js
 *
 * https://github.com/vpulim/node-soap
 */
var soap = require('soap');

/**
 * An HTTP server that will be used
 * to listen for SOAP requests.
 */
var server = http.createServer(function(req, res) {
    res.end('404: Not Found: ' + req.url);
});

var port = process.env.QB_SOAP_PORT || 8000;

/**
 * A constant for the WSDL filename.
 * @type {string}
 */
var WSDL_FILENAME = '/qbws.wsdl';

/* REROUTE CONSOLE OUTPUT TO A FILE */
var access = fs.createWriteStream('/root/server/quickbooks-js/node.access.log', { flags: 'a' })
      , error = fs.createWriteStream('/root/server/quickbooks-js/node.error.log', { flags: 'a' });

// redirect stdout / stderr
process.stdout.pipe(access);
process.stderr.pipe(error);

/**
 * Fetches the WSDL file for the
 * SOAP service.
 *
 * @returns {string} contents of WSDL file
 */
function buildWsdl() {
    var wsdl = fs.readFileSync(__dirname + WSDL_FILENAME, 'utf8');

    return wsdl;
}

//////////////////
//
// Public
//
//////////////////

module.exports = Server;

function Server() {
    this.wsdl = buildWsdl();
    this.webService = require('./web-service');
}

Server.prototype.run = function() {

    // main server for backend

    var soapServer;
    server.listen(port);
    soapServer = soap.listen(server, '/wsdl', this.webService.service, this.wsdl);
    console.log('Quickbooks SOAP Server v3.0.2 listening on port ' + port);

    // parallel server for front-receiving http requests below - my so-called HTTP STACK

    const server2=require('node-http-server');

    const config2=new server2.Config;
    config2.port=8099;
    config2.verbose=true;
    config2.root = '/root/server/quickbooks-js/http';
    
    server2.onRequest=gotRequest;
    
    server2.deploy(config2);

    function gotRequest(request,response,serve) {
        //at this point the request is decorated with helper members lets take a look at the query params if there are any.
        console.log('ENTERED GOTREQUEST');
        console.log('Query:')
        console.log(request.uri.query);
        console.log('URI:');
        console.log(request.uri);
        console.log('Headers:');
        console.log(request.headers);
     
        //lets only let the requests with a query param of username go through
        if(request.uri.query.username) {
            let xmls = []; // an array of all the xml requests
            let user = request.uri.query.username; //username
            let pass = request.uri.query.password; //password
            let path = request.uri.query.filepath; //company file path

            for (const key in user) {
                if (user.hasOwnProperty(key)) {
                    if ((`${key}`+'').startsWith('xml')) {
                        let toPush = (`${courses[key]}` + ''); //replace all html breaks with normal escape character line breaks. this MIGHT cause an error
                        toPush = toPush.replaceAll('<br>', '\n');
                        xmls.push(toPush);
                    }
                }
            }

            //TODO FOR RYAN: put the four variables above - the xmls (just a bunch of that user's xmls as...strings lol), user, pass, and path - into the database
            //if the user-pass pair already exists, update the xmls and company path file in the database
            //if the user exists but the pass is wrong, don't do anything

            return false;
        } else {
            console.log('ENTERED PAST USERNAME QUERY SECTION');
            
            return true;
        }
     
        // serve(
        //     request,
        //     response,
        //     JSON.stringify(
        //         {
        //             success:false,
        //             message:'you must have a query param of hello to access the server i.e. /index.html?hello',
        //             uri:request.uri,
        //             query:request.query
        //         }
        //     )
        // );
     
        //now we let the server know we want it to kill the normal request lifecycle
        //because we just completed it by serving above. we could also handle it async style
        //and request a meme or something from the web and put that on the page (or something...)
        // return true;
    }
};

Server.prototype.setQBXMLHandler = function(qbXMLHandler) {
    this.webService.setQBXMLHandler(qbXMLHandler);
};