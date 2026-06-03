import { User } from 'src/generated/prisma/client';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  upsertGoogleUser(data: {
    googleId: string;
    email: string;
    name: string;
    picture: string;
  }): Promise<User>;
}
