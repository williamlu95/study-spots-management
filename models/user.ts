import { Schema, model, models } from 'mongoose';

export const USER_ROLE = Object.freeze({
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MEMBER: 'member',
});

const userSchema = new Schema(
  {
    familyName: { type: String, required: true },
    givenName: { type: String, required: true },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(USER_ROLE),
      default: USER_ROLE.MEMBER,
    },
  },
  {
    timestamps: true,
  },
);

const User = models.user || model('user', userSchema);
export default User;
