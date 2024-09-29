import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, default: new Date() },

    assets: [String],
    team: [{ type: Schema.Types.ObjectId, ref: "User" }],
    isTrashed: { type: Boolean, default: false },
    columns: [{ type: Schema.Types.ObjectId, ref: "ColumnBoard" }],
  },

  { timestamps: true }
);
const Project = mongoose.model("Project", projectSchema);

export default Project;
