'use strict';

exports.handler = function(event, context, callback) {
   console.log("value1 = " + event.key1);
   console.log("value2 = " + event.key2);
   callback(null, "some success message");
}

/*
exports.handler = (event, context) => {
    event.Records.forEach(function(record) {
        var timestamp = record.kinesis.approximateArrivalTimestamp;
        var data = new Buffer(record.kinesis.data, 'base64').toString('ascii');
    });
    context.succeed('Success');
};
*/
