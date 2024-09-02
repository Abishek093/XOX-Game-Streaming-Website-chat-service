import { MongoAuthRepository } from "../infrastructure/Repositories/MongoAuthRepository";

const AuthRepositories = new MongoAuthRepository()
export const createUser = async(userData: any) => {
    console.log(userData)
    const response = await AuthRepositories.createUser(userData)
};

export const updateProfileImage = async(data: any)=>{
    const {userId, profileImage} = data 
    console.log(data)
    const response = await AuthRepositories.updateProfileImage(userId, profileImage)
}       

export const updateProfile = async(data: any)=>{
    const {userId, username, displayName, profileImage} = data
    console.log(data)
    const response = await AuthRepositories.updateProfile(userId, username, displayName, profileImage)
}                   

