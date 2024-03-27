import mongoose, { Schema, SchemaTypes } from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  subscriber: {
    type: SchemaTypes.ObjectId,
    ref: "User",
  },
  channel: {
    type: SchemaTypes.ObjectId,
    ref: "User",
  },
});

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
