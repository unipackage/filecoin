import mongoose, { Schema, Document } from "mongoose"
import { Message } from "../types"
import { ValueFields } from "@unipackage/utils"

interface MessageDocument extends ValueFields<Message>, Document {}

const MessageSchema = new Schema<MessageDocument>({
    MsgCid: {
        type: Object,
        required: [true, "Please provide the MsgCid"],
        index: { unique: true },
    },
    Height: {
        type: Number,
        required: [true, "Please provide the height"],
    },
    Replayed: {
        type: Boolean,
        required: [true, "Please provide the Replayed"],
    },
    Msg: {
        type: Object,
        required: [true, "Please provide the Msg"],
    },
    MsgRct: Object,
    GasCost: Object,
})

const MessageModel =
    mongoose.models.Message ||
    mongoose.model<MessageDocument>("Message", MessageSchema)

export { MessageModel }
export type { MessageDocument }
