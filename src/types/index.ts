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
  locationCode: string;
  reward?: number;
  createdAt: Date;
  ownerId: number;
}

export type UserDoc = Omit<User, "id"> & { password: string };
export type ItemDoc = Omit<Item, "id" | "ownerId"> & { ownerId: Types.ObjectId };
export type NewItemBody = Pick<Item, "title" | "status" | "reward" | "locationCode">;

// Location is reference data: the campus places an item can be reported at.
// It has no id of its own -- the code is its identity. LocationDoc is a Pick
// (a mapped type) because the toJSON transform needs a mapped type, not an interface.
export interface Location {
  code: string;
  name: string;
}

export type LocationDoc = Pick<Location, "code" | "name">;