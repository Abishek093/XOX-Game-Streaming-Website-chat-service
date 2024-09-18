import { AuthRepositories } from "../../domain/Repositories/AuthRepositories";
import UserModel, { IUser } from "../database/dbModels/User";

export class MongoAuthRepository implements AuthRepositories{
    async createUser(user: IUser): Promise<void>{
        try {
            const newUser = new UserModel({
                _id: user.userId,
                username: user.username,
                displayName: user.displayName,
                profileImage: user.profileImage
            })                              
            await newUser.save()
            console.log(newUser)
        } catch (error: any) {
            console.log(error)
        }
    }

    async updateProfileImage(userId: string, profileImage: string): Promise<void>{
        try {
            const user = await UserModel.findById(userId)
            if(user){
                user.profileImage = profileImage
                await user.save()
            }else{
                throw new Error("User not foud")
            }
        } catch (error) {
            console.log(error)
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