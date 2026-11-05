import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { isEmail } from 'validator';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'please enter an email'],
      unique: true,
      lowercase: true,
      validate: [isEmail, 'Please enter a valid email'],
    },
    firstName: {
      type: String,
      required: [true, 'please enter your First Name'],
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
      minlength: [6, 'Minimum password length is 6 characters'],
    },
    role: {
      type: String,
      required: [true, 'Please select a role'],
      enum: ['Admin', 'Client'],
      default: 'Client',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    verificationTokenExpire: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.post('save', async function (doc, next) {
  console.log('New User Registered', doc.email);
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw Error('incorrect email');
  }

  const auth = await bcrypt.compare(password, user.password);
  if (!auth) {
    throw Error('incorrect password');
  }

  return user;
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
