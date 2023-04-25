import type { Cookies } from "@sveltejs/kit";
import type { ISession, IUser } from "../types/database";
import Sessions from "$lib/server/database/models/sessions";
import Users from "$lib/server/database/models/users";
import { SESSION_COOKIE_NAME } from "$env/static/private";
import { connectToDB, connectionStatus } from '../database/index';
import mongoose from 'mongoose';
import { createHash } from "node:crypto";
import { v4 } from "uuid";


// Hex because we're so cool here :laugh:
const MaxSession = 0x39ADA00;

export const validateSession = async (cookies: Cookies): Promise<{ session: ISession; user: IUser } | undefined> => {
    const sessionID = cookies.get(SESSION_COOKIE_NAME);

    if (!sessionID) return;

    try {
        if (
            connectionStatus.status == mongoose.ConnectionStates.disconnected ||
            connectionStatus.status == mongoose.ConnectionStates.uninitialized
        ) {
            await connectToDB();
        }
        // eslint-disable-next-line no-empty
    } catch (_) { }

    const sess: ISession | null = await Sessions.findById(Buffer.from(sessionID, 'hex').toString());

    if (sess == null || sess.ExpiresAt < new Date().getTime()) {
        cookies.delete(SESSION_COOKIE_NAME);
        return;
    }

    const user = await Users.findById(sess.UserID);
    if (user == null) {
        cookies.delete(SESSION_COOKIE_NAME);
        return;
    }

    return { session: sess, user: user.toObject({ getters: false }) as IUser };
};

export const isSessionValid = async (cookies: Cookies): Promise<boolean> => {
    const sessionID = cookies.get(SESSION_COOKIE_NAME);

    if (!sessionID) return false;

    try {
        if (connectionStatus.status != mongoose.ConnectionStates.connected) {
            await connectToDB();
        }
        // eslint-disable-next-line no-empty
    } catch (_) { }

    const sess: ISession | null = await Sessions.findById(Buffer.from(sessionID, 'hex').toString());

    if (sess == null || sess.ExpiresAt < new Date().getTime()) {
        cookies.delete(SESSION_COOKIE_NAME);
        return false;
    }

    return true;
};

// little util function
const hash = (str: string): string => createHash("sha256").update(str).digest("base64url")

export const newSession = async (cookies: Cookies, UserID: string): Promise<void> => {
    // get & delete old sessions bc fuck you
    const sessions: ISession[] = await Sessions.find({ UserID });
    if (sessions.length > 0) {
        sessions.forEach(async (sess: ISession) => {
            await Sessions.findByIdAndDelete(sess._id);
        });
    }

    const sessionID = hash(v4());

    await new Sessions({
        _id: sessionID,
        ExpiresAt: new Date().getTime() + MaxSession,
        UserID
    }).save();

    cookies.set(SESSION_COOKIE_NAME, Buffer.from(sessionID).toString('hex'), { path: '/', sameSite: 'lax' });
    return;
};

export const deleteSession = async (cookies: Cookies): Promise<void> => {
    const sess = cookies.get(SESSION_COOKIE_NAME);
    if (!sess) return;
    await Sessions.findByIdAndDelete(Buffer.from(sess, 'hex').toString());
    cookies.delete(SESSION_COOKIE_NAME);
};

export const getUserFromSession = async (cookies: Cookies): Promise<IUser> => {
    const sessionID = cookies.get(SESSION_COOKIE_NAME);

    if (!sessionID) return {} as IUser;

    try {
        if (connectionStatus.status != mongoose.ConnectionStates.connected) {
            await connectToDB();
        }
        // eslint-disable-next-line no-empty
    } catch (_) { }

    const sess: ISession | null = await Sessions.findById(Buffer.from(sessionID, 'hex').toString());

    if (sess == null) return {} as IUser;

    if (sess.ExpiresAt < new Date().getTime()) return {} as IUser;

    const user = await Users.findById(sess.UserID);

    if (user == null) return {} as IUser;

    return user;
};
