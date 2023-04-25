/* NOTES: 
This is the same from Sirius Applications cause I was too lazy to rewrite
Also make sure to call disconnect <3
*/
import mongoose from 'mongoose';
import { MONGO_URI } from '$env/static/private';

export const Connection = {
    Mongoose: mongoose
};

interface connectionTracker {
    status: mongoose.ConnectionStates;
}
export const connectionStatus: connectionTracker = {
    status: mongoose.ConnectionStates.uninitialized
};

export const connectToDB = async () => {
    const Start = Date.now();
    if (connectionStatus.status == mongoose.ConnectionStates.connected) {
        throw Error('Mongoose is already connected');
    }
    if (mongoose.connections.length > 0) {
        connectionStatus.status = mongoose.connections[0].readyState;
        if (connectionStatus.status == mongoose.ConnectionStates.connected) {
            throw Error('There is already a connected instance');
        }
        await mongoose.disconnect();
    }
    connectionStatus.status = mongoose.ConnectionStates.connecting;
    const con = await mongoose.connect(MONGO_URI, { keepAlive: true, keepAliveInitialDelay: 300000 });
    connectionStatus.status = mongoose.ConnectionStates.connected;
    // successfully connected!
    Connection.Mongoose = con;
    console.log(`Sucessfully connected to Database in ${Date.now() - Start}ms!`);
};

export const disconnectFromDB = async () => {
    const startTime = Date.now();
    if (connectionStatus.status != mongoose.ConnectionStates.connected) throw Error('Not connected to database.');
    connectionStatus.status = mongoose.ConnectionStates.disconnecting;

    await mongoose.disconnect();
    connectionStatus.status = mongoose.ConnectionStates.disconnected;
    console.log(`Disconnected from the database in ${Date.now() - startTime} ms.`);
};