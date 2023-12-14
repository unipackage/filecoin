import mongoose, { Schema, Document } from "mongoose"
import { BlockMessages } from "../types"
import { ValueFields } from "@unipackage/utils"

interface BlockMessagesDocument extends ValueFields<BlockMessages>, Document {}

const BlockMessagesSchema = new Schema<BlockMessagesDocument>({
    BlockCid: {
        type: Object,
        required: [true, "Please provide the BlockCid"],
        index: { unique: true },
    },
    Height: {
        type: Number,
        required: [true, "Please provide the Height"],
    },
    Cids: {
        type: [Object],
        required: [true, "Please provide the Cids"],
    },
    BlsMessages: {
        type: [Object],
        required: [true, "Please provide the BlsMessages"],
    },
    SecpkMessages: {
        type: [Object],
        required: [true, "Please provide the SecpkMessages"],
    },
})

const BlockMessagesModel =
    mongoose.models.BlockMessages ||
    mongoose.model<BlockMessagesDocument>("BlockMessages", BlockMessagesSchema)

export { BlockMessagesModel }
export type { BlockMessagesDocument }
