var utils = require('zefti-utils');
var common = require('zefti-common');
var uuid = require('node-uuid');
var randtoken = require('rand-token');
var settings =require('zefti-config').currentSettings;


var typeMap = {
    string : 'S'
  , number : 'N'
  , binary : 'BOOL'
};

var expressionMap = {
    "$gt" : " > :"
  , "$lt" : " < :"
  , "$gte" : " >= :"
  , "$lte" : " <= :"
};

var Sqs = function(db, options){
  this.db = db;
  if (options.queueUrl) this.queueUrl = options.queueUrl;
  return this;
};

function createItem(hash){
  var item = {};
  for (var key in hash) {
    var someKey = {};
    var type = typeMap[utils.type(hash[key])];
    someKey[type] = hash[key].toString();
    item[key] = someKey;
  }
  return item;
}

Sqs.prototype.create = function(hash, options, cb){
  var intArgs = common.process3DbArguments(arguments);
  var stringifiedMessageBody = JSON.stringify(hash);
  //if (!hash.messageBody) return cb('messageBody is required', null);
  var params = {
      MessageBody : stringifiedMessageBody
    , QueueUrl : this.queueUrl
  };

  if (options.alertTime) {
    var now = new Date().getTime();
    var alertTime = parseInt(options.alertTime);
    var delay = alertTime - now;
    console.log(alertTime);
    console.log(now);
    console.log('delay: ' + delay);

    params.DelaySeconds = (delay/1000);
    params.DelaySeconds = 60;
  }

  console.log(params);

  this.db.sendMessage(params, function(err, data){
    console.log('sqs create err:');
    console.log(err);
    console.log(data);
    console.log('-------')
  });
};

Sqs.prototype.find = function(hash, fieldMask, options, cb){
  var params = {
      QueueUrl : this.queueUrl
    , WaitTimeSeconds : settings.queueWaitTime
    , VisibilityTimeout : settings.queueVisibilityTimeout
  };
  this.db.receiveMessage(params, function(err, items){
    if (items) items = items.Messages;
    return cb(err, items);
  });
};

Sqs.prototype.findAndModify = function(hash, sort, update, options, cb){

};


Sqs.prototype.findById = function(id, fieldMask, options, cb){

};

Sqs.prototype.findByIdMulti = function(ids, fieldMask, options, cb){

};

Sqs.prototype.upsert = function(hash, update, options, cb){

};

Sqs.prototype.update = function(hash, update, options, cb){

};

Sqs.prototype.updateById = function(id, update, options, cb){

};

Sqs.prototype.remove = function(hash, options, cb){

};

Sqs.prototype.removeById = function(id, options, cb){

};

Sqs.prototype.removeFields = function(hash, update, options, cb){

};

Sqs.prototype.removeFieldsById = function(id, fields, options, cb){

};

Sqs.prototype.addToSet = function(hash, update, options, cb){

};

Sqs.prototype.addToSetById = function(id, update, options, cb){

};

Sqs.prototype.removeFromSet = function(hash, update, options, cb){

};

Sqs.prototype.removeFromSetById = function(id, update, options, cb){

};

Sqs.prototype.expire = function(hash, options, cb){

};

Sqs.prototype.expireById = function(id, options, cb){

};

Sqs.prototype.getNewId = function(options){

};





module.exports = Sqs;
