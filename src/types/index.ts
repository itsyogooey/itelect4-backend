import type { Types } from "mongoose";

export interface User {
  id: number;
  name: string;
  email: string;
  role: "student" | "admin" | "instructor";
  isActive: boolean;
}

export interface Item {
  id: number;
  title: string;
  status: "lost" | "found" | "claimed";
  reward?: number;
  createdAt: Date;
  ownerId: number;
}

export type UserDoc = Omit<User, "id"> & { password: string };
export type ItemDoc = Omit<Item, "id" | "ownerId"> & { ownerId: Types.ObjectId };
export type NewItemBody = Pick<Item, "title" | "status" | "reward">;