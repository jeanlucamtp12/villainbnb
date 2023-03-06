const mongoose = require('../database');

const UserSchema = new mongoose.Schema ({

    titulo: {
        type: String,
        required: true,
        unique: true,
    },

    nome_fachada: {
        type: String,
        required: true,
        select: false,
    },

    cidade: {
        type: String,
        required: true,
    },

    tecnologias: {
        type: String,
        required: true,
    },

    aluguel: {
        type: Boolean,
        default: false,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    }
});


const User = mongoose.model('User', UserSchema);

module.exports = User;