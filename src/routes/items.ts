import { Router } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import { Types } from "mongoose";
import { requireAuth } from "../middleware/auth.js";
import { ItemModel } from "../models/Item.js";
import type { NewItemBody } from "../types/index.js";

export const itemRouter = Router();
itemRouter.use(requireAuth);

itemRouter.get("/", async (req, res) => {
  const items = await ItemModel.find({ ownerId: req.userId! }).sort({ createdAt: -1 });
  res.json(items);
});

itemRouter.get<ParamsDictionary>("/:id", async (req, res) => {
  const item = await ItemModel.findOne({ _id: req.params.id, ownerId: req.userId! });
  if (!item) {
    res.status(404).json({ message: "No item with that id" });
    return;
  }
  res.json(item);
});

itemRouter.post<ParamsDictionary, unknown, NewItemBody>("/", async (req, res) => {
  const item = await ItemModel.create({
    ...req.body,
    createdAt: new Date(),
    ownerId: new Types.ObjectId(req.userId!),
  });
  res.status(201).json(item);
});

itemRouter.patch<ParamsDictionary, unknown, Partial<NewItemBody>>("/:id", async (req, res) => {
  const item = await ItemModel.findOneAndUpdate(
    { _id: req.params.id, ownerId: req.userId! },
    req.body,
    { new: true, runValidators: true },
  );
  if (!item) {
    res.status(404).json({ message: "No item with that id" });
    return;
  }
  res.json(item);
});

itemRouter.delete<ParamsDictionary>("/:id", async (req, res) => {
  const item = await ItemModel.findOneAndDelete({ _id: req.params.id, ownerId: req.userId! });
  if (!item) {
    res.status(404).json({ message: "No item with that id" });
    return;
  }
  res.status(204).send();
});