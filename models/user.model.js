const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = Schema(
    {
        username: {
            type: String,
            required: [true, 'Name field is required'],
        },
        email: {
            type: String,
            required: [true, 'Email field is required'],
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, 'Password field is required'],
        },
    },
    { timestamps: true }
);

userSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password, function(result) {
        return result;
    });
};

userSchema.methods.compareName = function(name){
    console.log("getting name");
    
    return name === this.username;
}

module.exports = model('User', userSchema);