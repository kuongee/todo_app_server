import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const UserSchema = new Schema({
  username: String,
  hashedPassword: String,
});

UserSchema.methods.setPassword = function (password) {
  return new Promise(resolve => {
    bcrypt.hash(password, 10).then(hash => {
      this.hashedPassword = hash;
      resolve();
    });
  });
};

// https://programmingsummaries.tistory.com/399

UserSchema.methods.checkPassword = function (password) {
  return new Promise(resolve => {
    bcrypt.compare(password, this.hashedPassword).then(result => {
      resolve(result);
    });
  });
};

UserSchema.statics.findByUsername = function (username) {
  return new Promise(resolve => {
    resolve(this.findOne({ username }));
  });
};

UserSchema.methods.serialize = function () {
  const data = this.toJSON();
  delete data.hashedPassword;
  return data;
};

UserSchema.methods.generateToken = function () {
  const token = jwt.sign(
    {
      _id: this.id,
      username: this.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    }
  );
  return token;
};

const User = mongoose.model('User', UserSchema);
export default User;
