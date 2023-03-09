//configuração para conexão com o banco usando mongoose
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/noderest', {autoIndex: true}, {ignoreUndefined: true});

mongoose.Promise = global.Promise;

module.exports = mongoose;