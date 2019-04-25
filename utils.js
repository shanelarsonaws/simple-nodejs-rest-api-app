module.exports = {
    "exit": function exit(reason) {
        console.log("EXITING ===> " + reason);
        process.exit();
    }
}
