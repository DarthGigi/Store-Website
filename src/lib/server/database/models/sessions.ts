import mongoose from "mongoose";
import type { ISession } from '../../types/database';


const schema = new mongoose.Schema<ISession>(
    {
        _id: {type: String, required: true},
        UserID: {type: String, required: true},
        ExpiresAt: {type: Number, required: true}
    }
);

export default mongoose.connection.models.sessions || mongoose.connection.model("sessions", schema);