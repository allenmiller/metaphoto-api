'use strict';

const doc = require('dynamodb-doc');
const dynamo = new doc.DynamoDB();

exports.handler = (event, context, callback) => {
  console.log('Received event:', JSON.stringify(event, null, 2));
};
