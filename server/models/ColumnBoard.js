import mongoose, { Schema } from "mongoose";

const columnSchema = new Schema({
  name: { type: String, required: true },
  project: [{ type: Schema.Types.ObjectId, ref: "Project" }],
  tasks: [{ type: Schema.Types.ObjectId, ref: "BoardTask" }],
});

const ColumnBoard = mongoose.model("ColumnBoard", columnSchema);

export default ColumnBoard;
