import mongoose, { Schema, Document } from "mongoose"
import { TipsetProperties } from "../types"

interface TipsetDocument extends TipsetProperties, Document {}

const TipsetSchema = new Schema<TipsetDocument>({
    Height: {
        type: Number,
        required: [true, "Please provide the Height"],
        index: { unique: true },
    },
    Cids: {
        type: [Object],
        required: [true, "Please provide the Cids"],
    },
    Blocks: {
        type: [Object],
        required: [true, "Please provide the Blocks"],
    },
})

const TipsetModel =
    mongoose.models.Tipset ||
    mongoose.model<TipsetDocument>("Tipset", TipsetSchema)

export { TipsetModel }
export type { TipsetDocument }
