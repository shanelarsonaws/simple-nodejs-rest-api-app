const mongodbConfig = require("./mongodbConfig");

const fs = require("fs");
const mongodb = require("mongodb");

const utils = require("./utils");
const exit = utils.exit;

if (mongodbConfig.connectionString === "") {
    exit("The connection string is missing from the mongodbConfig.js file!");
}

const rawDemoVendorJsonData = fs.readFileSync('./demoVendorData.json', {
    "encoding": "utf8"
});

let parsedDemoVendorJsonData;

try {
    parsedDemoVendorJsonData = JSON.parse(rawDemoVendorJsonData);
} catch (e) {
    exit("Error parsing the demo vendor data!");
}

mongodb.connect(mongodbConfig.connectionString, {
    "useNewUrlParser": true
}, function (err, db) {
    if(err){
        exit(err);
    }

    const vendorsDb = db.db("jobTestApi");

    const vendorCollection = vendorsDb.collection("vendors");

    let vendorsAdded = 0;

    parsedDemoVendorJsonData.forEach(vendorData => {
        vendorCollection.insertOne(vendorData, function() {
            vendorsAdded += 1;
            if(vendorsAdded === parsedDemoVendorJsonData.length){
                db.close();
                exit("Complete");
            }
        });
    });
});
