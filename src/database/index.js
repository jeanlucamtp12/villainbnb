const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/noderest', {autoIndex: true});

mongoose.Promise = global.Promise;

module.exports = mongoose;