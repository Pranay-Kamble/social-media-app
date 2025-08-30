import { Schema, mongoose } from 'mongoose';

const userSchema = new Schema({
    username : {
        type: String,
        required : true
    },
    userid : {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20
    },
    email : {
        type: String,
        required: true
    },
    phoneNumber : String,
    registeredOn : {
        type: Date,
        required : true,
        default: Date.now
    },
    password : {
        type: String,
        minLength: 8,
        maxLength: 20,
        required: true 
    },
    lastLogin : {
        type: Date
    },
    profilePicture : {
        type: String
    },
    bio : {
        type: String,
        default: "",
        maxLength: 250
    }
});

const user = mongoose.model('User', userSchema);

export default user;