import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const AuthorSchema = new Schema(
  {
    name: { type: String, required: true },
    avatar: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "User", enum: ["User", "Admin"] },
  
  
},
  {
    timestamps: true,
  }
);

AuthorSchema.pre("save", async function (next) {
  const newAuthor = this;
  const password = newAuthor.password;
  if (newAuthor.isModified("password")) {
    const hashedPassword = await bcrypt.hash(password, 10);
    newAuthor.password = hashedPassword;
  }
  next();
});

AuthorSchema.methods.toJSON = function () {
  const authorDoc = this;
  const authorObject = authorDoc.toObject();

  return authorObject;
};

 AuthorSchema.statics.checkTheCredentials = async function (email, password) {
  const author = await this.findOne({email});

  if (author) {
    const matchAuthor = await bcrypt.compare(password,author.password);
    if (matchAuthor) {
      return author;
    } else {
      return null;
    }
  } else {
    return null;
  }
};
export default model("Author", AuthorSchema);
