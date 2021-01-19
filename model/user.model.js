const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "Please inter your name."],
        trim: true,
    },
    email: {
        type: String,
        require: [true, "Please inter your email."],
        trim: true,
    },
    password: {
        type: String,
        require: [true, "Please inter your password."],
    },
    role: {
        type: Number,
        default: 0, // 0 is user, 1 is admin
    },
    avatar: {
        type: Object,
        default: {
            public_id: '',
            url: 'https://res.cloudinary.com/dxnfxl89q/image/upload/v1609941293/javcommerce/person_slkixq.jpg'
        }
    }
})
module.exports = mongoose.model('Users', UserSchema);