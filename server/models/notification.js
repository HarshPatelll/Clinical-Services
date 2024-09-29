import mongoose, { Schema } from "mongoose";

const noticeSchema = new Schema(
    {
        team: [{ type: Schema.Types.ObjectId, ref: "User" }],
        text: { type: String },
        task: { type: Schema.Types.ObjectId, ref: "BoardTask"},
        notiType: { type: String, default: "alert", enum: ["alert","message"]},
        isRead: [{ type: Schema.Types.ObjectId, ref: "User"}],
    },
    {timestamp: true}
);

const Notice = mongoose.model("Notice", noticeSchema);

export default Notice;