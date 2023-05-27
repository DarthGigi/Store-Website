export enum Plans {
  FREE,
  ESSENITAL,
  PRO
}

export interface IDiscordUser {
  User: {
    id: string;
    username: string;
    discriminator: string;
    avatar?: string;
    banner?: string | null;
    accent_color?: number | null;
  };
}

export interface IUser {
  _id: string;
  discord: IDiscordUser;
  plan: Plans;
}

export interface ISession {
  _id: string;
  UserID: string;
  ExpiresAt: number;
}
