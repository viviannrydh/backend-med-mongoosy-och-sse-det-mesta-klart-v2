const { Schema, model } = require('mongoose');
const modelName = 'Message';

let schema = new Schema({
  text: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  recipients: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  sent: { type: Date, default: Date.now }
});

module.exports = model(modelName, schema);