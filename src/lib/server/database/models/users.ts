import mongoose from "mongoose";
import type { IUser } from '../../types/database';


const schema = new mongoose.Schema<IUser>(
    {
        _id: {type: String, required: true},
        discord: {type: Object, required: true},
        plan: {type: Number, default: 0}
    }
);

export default mongoose.connection.models.users || mongoose.connection.model("users", schema);