import mongoose from "mongoose"
const {Schema,model} = mongoose

const UserSchema = new Schema({
    firstname: { type: String, required: true },
      lastname: { type: String, required: true },
},{
    timestamps:true
})

export default model("User",UserSchema )