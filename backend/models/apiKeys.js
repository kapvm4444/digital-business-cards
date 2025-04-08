const mongoose = require('mongoose');
const apiKeySchema = new mongoose.Schema(
  {
    key: {
      type: Number,
      default: 1,
    },
    GoogleMapsApiKey: String,
    BrevoApiKey: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const ApiKeys = mongoose.model('ApiKeys', apiKeySchema);
