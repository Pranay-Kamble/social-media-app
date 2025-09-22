import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = new mongoose.Schema({
    display_name : { //Rendered only on the profile page of the user
        type: String,
        required : true
    },
    username : { //this is used to display the user
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20,
        unique: true
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber : String,
    registeredOn : {
        type: Date,
        required : true,
        default: Date.now
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
//passwords are handled by passport js
userSchema.plugin(passportLocalMongoose);


export default (mongoose.models.User) || (mongoose.model('User', userSchema));