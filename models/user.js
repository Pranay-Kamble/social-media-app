import { Schema, mongoose } from 'mongoose';

const userSchema = new Schema({
    username : { //Rendered only on the profile page of the user
        type: String,
        required : true
    },
    userid : { //this is used to display the user
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
        required: [true , 'Password cannot be blank'],
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