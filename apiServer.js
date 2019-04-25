const mongodbConfig = require("./mongodbConfig");

const mongodb = require("mongodb");
const express = require("express");
const bodyParser = require("body-parser");

const utils = require("./utils");
const exit = utils.exit;

const endpoints = require("./endpointHandlers");

if (mongodbConfig.connectionString === "") {
    exit("The connection string is missing from the mongodbConfig.js file!");
}

let vendorsDb,
    vendorCollection;

mongodb.connect(mongodbConfig.connectionString, {
    "useNewUrlParser": true
}, function (err, db) {
    if (err) {
        exit(err);
    }

    vendorsDb = db.db("jobTestApi");

    vendorCollection = vendorsDb.collection("vendors");

    initializeExpress();
});

function initializeExpress() {
    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.post("/getVendor", endpoints.getVendor.bind({
        vc: vendorCollection,
        objectID: mongodb.ObjectID
    }));

    app.post("/getVendors", endpoints.getVendors.bind({
        vc: vendorCollection
    }));

    app.post("/createVendor", endpoints.createVendor.bind({
        vc: vendorCollection
    }));

    app.post("/updateVendor", endpoints.updateVendor.bind({
        vc: vendorCollection,
        objectID: mongodb.ObjectID
    }));

    app.post("/removeVendor", endpoints.removeVendor.bind({
        vc: vendorCollection,
        objectID: mongodb.ObjectID
    }));

    app.listen(8080);
}
