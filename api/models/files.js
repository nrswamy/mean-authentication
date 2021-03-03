const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  originalname: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  namea: {
    type: String,
    required: false
  },
  nameb: {
    type: String,
    required: false
  },
  namec: {
    type: String,
    required: false
  }
});

mongoose.model('File', fileSchema);
