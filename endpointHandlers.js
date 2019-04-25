function isVendorValid(vendorObject) {
    if (Object.keys(vendorObject).length === 3 && typeof (vendorObject.email) === "string" && vendorObject.email !== "" && typeof (vendorObject.name) === "string" && vendorObject.name !== "" && Array.isArray(vendorObject.codes)) {
        if (/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(vendorObject.email)) {
            return {
                success: true
            };
        } else {
            return {
                success: false,
                errorMessage: "invalid email"
            };
        }
    } else {
        return {
            success: false,
            errorMessage: "invalid Vendor Object"
        };
    }
}

module.exports = {
    "getVendor": function (request, response) {
        const collection = this.vc;
        const ObjectID = this.objectID;
        const id = request.body.id;
        let parsedId;
        try {
            parsedId = ObjectID(id);
        } catch (e) {
            response.json({
                error: true,
                errorMessage: "invalid Vendor ID entered"
            });
            return false;
        }
        collection.findOne({
            "_id": parsedId
        }, function (error, vendorResult) {
            if (error) {
                response.json({
                    error: true,
                    errorMessage: "there was an issue with the database query"
                });
            } else {
                if (vendorResult !== null) {
                    response.json({
                        error: false,
                        vendorResult: vendorResult
                    });
                } else {
                    response.json({
                        error: false,
                        vendorResult: null
                    });
                }
            }
        });
    },
    "getVendors": function (request, response) {
        const collection = this.vc;
        const vendorsToSkip = request.body.vendorsToSkip;

        collection.find({}).limit(2).skip(parseInt(vendorsToSkip)).sort({
            _id: 1
        }).toArray(function (error, vendorResults) {
            if (error) {
                response.json({
                    error: true,
                    errorMessage: "there was an issue with the database query"
                });
            } else {
                if (vendorResults !== null) {
                    response.json({
                        error: false,
                        vendorResults: vendorResults
                    });
                } else {
                    response.json({
                        error: false,
                        vendorResults: []
                    });
                }
            }
        });
    },
    "createVendor": function (request, response) {
        const collection = this.vc;
        let newVendorObject = request.body.newVendorObject;
        try {
            newVendorObject = JSON.parse(newVendorObject);
        } catch (e) {
            return false;
        }
        const validVendorObject = isVendorValid(newVendorObject);

        if (validVendorObject.success) {
            collection.insertOne(newVendorObject, function (error, insertResult) {
                if (error) {
                    response.json({
                        error: true,
                        errorMessage: "there was an issue with the database query"
                    });
                } else {
                    response.json({
                        error: false,
                        newVendorId: insertResult.insertedId
                    });
                }
            });
        } else {
            response.json({
                error: true,
                errorMessage: validVendorObject.errorMessage
            });
        }
    },
    "updateVendor": function (request, response) {
        const collection = this.vc;
        const ObjectID = this.objectID;
        const id = request.body.id;
        let parsedId;
        try {
            parsedId = ObjectID(id);
        } catch (e) {
            response.json({
                error: true,
                errorMessage: "invalid Vendor ID entered"
            });
            return false;
        }
        let newVendorObject = request.body.newVendorObject;
        try {
            newVendorObject = JSON.parse(newVendorObject);
        } catch (e) {
            return false;
        }

        const validVendorObject = isVendorValid(newVendorObject);

        if (validVendorObject.success) {
            collection.updateOne({
                "_id": parsedId
            }, {$set: {newVendorObject}}, function (error, updateResult) {
                if (error) {
                    response.json({
                        error: true,
                        errorMessage: "there was an issue with the database query"
                    });
                } else {
                    response.json({
                        error: false,
                        vendorUpdated: updateResult.modifiedCount === 0 ? false : true
                    });
                }
            });
        } else {
            response.json({
                error: true,
                errorMessage: validVendorObject.errorMessage
            });
        }
    },
    "removeVendor": function (request, response) {
        const collection = this.vc;
        const ObjectID = this.objectID;
        const id = request.body.id;
        let parsedId;
        try {
            parsedId = ObjectID(id);
        } catch (e) {
            response.json({
                error: true,
                errorMessage: "invalid Vendor ID entered"
            });
            return false;
        }
        collection.deleteOne({
            "_id": parsedId
        }, function (error, deleteResult) {
            if (error) {
                response.json({
                    error: true,
                    errorMessage: "there was an issue with the database query"
                });
            } else {
                response.json({
                    error: false,
                    vendorDeleted: deleteResult.result.n === 0 ? false : true
                });
            }
        });
    }
};
