import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
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

userSchema.pre('save', async function(next) {
    if (!this.isModified('password'))
        return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.lastLogin = Date.now();
    next();
})

userSchema.statics.findUserAndValidate = async function(userid, password) {
    const foundUser = await this.findOne({userid});
    if (!foundUser) return false;
    const isValid = await bcrypt.compareSync(password, foundUser.password);

    return isValid ? foundUser : false;
}

const user = mongoose.model('User', userSchema);
export default user;