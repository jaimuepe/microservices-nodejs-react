import { Schema, model, Model, Document } from 'mongoose';
import { Password } from '../services/password';

// an interface representing a document in MongoDB.
interface UserAttrs {
  email: string;
  password: string;
}

// an interface that describes the properties
// that a user model has
interface UserModel extends Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// an interface that describes the properties
// that a User Document has
interface UserDoc extends Document {
  email: string;
  password: string;
}

const userSchema = new Schema<UserDoc>({
  email: { type: String, required: true },
  password: { type: String, required: true }
});

// we need access to the User object so we can't
// use arrow functions (different scope of the 
// 'this' keyword)
userSchema.pre('save', async function (done) {

  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.password);
    this.password = hashed;
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = model<UserDoc, UserModel>('User', userSchema);

export { User };