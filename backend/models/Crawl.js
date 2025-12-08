// server/models/Crawl.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const stopSchema = new Schema({
  externalId: String,          // ID from OpenBreweryDB (or another API later)
  name: String,
  lat: Number,
  lng: Number,
  address: String,
  order: Number,
});

const crawlSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    stops: [stopSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Crawl', crawlSchema);
