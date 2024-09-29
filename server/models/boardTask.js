import mongoose, { Schema } from "mongoose";


const boardtaskSchema = new Schema({
  title: { type: String, required: true },
  columnBoard: [{ type: Schema.Types.ObjectId, ref: "ColumnBoard" }],
  position: { type: Number },
  description: { type: String },
  status: {
    type: String,
    required: true,
    default: "Todo",
  },
  team: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const boardTask = mongoose.model("BoardTask", boardtaskSchema);

export default boardTask;
