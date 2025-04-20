const mongoose = require('mongoose');

const stateCollection = require('./../utils/stateCollection');
const cityCollection = require('./../utils/cityCollection');

//=>
// Defining the Card schema
const cardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'the card must belong to a user'],
    },
    category: [String],
    subCategory: [String],
    frontImage: String,
    backImage: String,
    businessName: {
      type: String,
      required: [true, 'Business must have a name'],
    },
    owner: [
      {
        type: new mongoose.Schema({
          name: String,
          dialCode: String,
          mobile: Number,
        }),
      },
    ],
    lanLine: Number,
    fax: Number,
    emails: [
      {
        type: String,
        validate: [validator.isEmail, 'email is Invalid'],
      },
    ],
    address: String,
    city: {
      type: String,
      validator: [
        function (val) {
          return cityCollection.includes(val);
        },
        'City not found',
      ],
    },
    state: {
      type: String,
      validator: [
        function (val) {
          return stateCollection.includes(val);
        },
        'State not found',
      ],
    },
    country: {
      type: String,
      default: 'India',
    },
    zipcode: {
      type: Number,
    },
    longitude: {
      type: Number,
      set: function (val) {
        return parseFloat(val.toFixed(6));
      },
    },
    latitude: {
      type: Number,
      set: function (val) {
        return parseFloat(val.toFixed(6));
      },
    },
    tags: [String],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;
