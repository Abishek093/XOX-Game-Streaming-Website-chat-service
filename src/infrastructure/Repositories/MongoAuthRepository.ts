import { AuthRepositories } from "../../domain/Repositories/AuthRepositories";
import UserModel, { IUser } from "../database/dbModels/User";

export class MongoAuthRepository implements AuthRepositories{
    async createUser(user: IUser): Promise<void>{
        const newUser = new UserModel({
            _id: user.userId,
            username: user.username,
            displayName: user.displayName,
            profileImage: user.profileImage
        })                              
        await newUser.save()
    }

    async updateProfileImage(userId: string, profileImage: string): Promise<void>{
        const user = await UserModel.findById(userId)
        if(user){
            user.profileImage = profileImage
            await user.save()
        }else{
            throw new Error("User not foud")
        }
    }

    async updateProfile(userId: string, username: string, displayName: string, profileImage: string):Promise<void>{
        const user = await UserModel.findByIdAndUpdate({_id: userId}, {
            username: username,
            displayName: displayName, 
            profileImage: profileImage
        })
    }
}