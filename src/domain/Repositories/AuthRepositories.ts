import { IUser } from "../../infrastructure/database/dbModels/User";

export  interface AuthRepositories{
    createUser(user: IUser): Promise<void>
    updateProfileImage(userId: string, profileImage: string):Promise<void>
    updateProfile(userId: string, username: string, displayName: string, profileImage: string):Promise<void>
}                   