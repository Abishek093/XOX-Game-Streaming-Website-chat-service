import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    userId: string;
    username: string;
    displayName: string;
    profileImage: string;
}

const UserSchema: Schema = new Schema({
    id: { type: String, required: false },
    username: { type: String, required: true },
    displayName: { type: String, required: true },
    profileImage: { type: String },
});


// PostSchema.set('toObject', { virtuals: true });
// PostSchema.set('toJSON', { virtuals: true });

const UserModel = mongoose.model<IUser>('User', UserSchema);

export default UserModel;
