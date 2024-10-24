// src/models/User.ts
import mongoose, { Schema } from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

// Configure passport-local-mongoose to use email instead of username
UserSchema.plugin(passportLocalMongoose, {
    usernameField: 'email',  // This will use email as the username field
});

const User = mongoose.model('User', UserSchema);
export default User;
