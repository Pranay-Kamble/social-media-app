import mongoose from 'mongoose';
import user from '../models/user.js'
import comment from '../models/comment.js'
import post from '../models/post.js'
import { userData , postData, commentData } from './data.js'


mongoose.connect('mongodb://127.0.0.1/SocialMediaApplication')
    .then(() => {
        console.log("Connected to the Database in Index.js");
    })
    .catch(() => {
        console.log("Could not connect to Database in Index.js");
    })

const seedDB = async () => {
    // await user.deleteMany({});
    // await user.insertMany(userData); 
    // await post.deleteMany({});
    // await post.insertMany(postData);

    await comment.deleteMany({});
    await comment.insertMany(commentData);

    console.log("What do you think,has it worked?")
}

seedDB()
.then(() => {
    console.log("The Data has been seeded into the database hahahahahahahah from index.js");
    mongoose.connection.close();
})
.catch(() => {
    console.log("Bruhh why does this happen to mee from index.js!!!");
})
