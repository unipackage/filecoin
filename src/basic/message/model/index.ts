/*******************************************************************************
 *   (c) 2023 unipackage
 *
 *  Licensed under either the MIT License (the "MIT License") or the Apache License, Version 2.0
 *  (the "Apache License"). You may not use this file except in compliance with one of these
 *  licenses. You may obtain a copy of the MIT License at
 *
 *      https://opensource.org/licenses/MIT
 *
 *  Or the Apache License, Version 2.0 at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the MIT License or the Apache License for the specific language governing permissions and
 *  limitations under the respective licenses.
 ********************************************************************************/

import mongoose, { Schema, Document } from "mongoose"
import { Message } from "../types"
import { ValueFields } from "@unipackage/utils"

// Define the document interface for the Message schema
interface MessageDocument extends ValueFields<Message>, Document {}

// Define the Message schema
const MessageSchema = new Schema<MessageDocument>({
    // CID of the message
    MsgCid: {
        type: Object,
        required: [true, "Please provide the MsgCid"],
        index: { unique: true },
    },
    // Height at which the message was included
    Height: {
        type: Number,
        required: [true, "Please provide the height"],
    },
    // Flag indicating whether the message has been replayed
    Replayed: {
        type: Boolean,
        required: [true, "Please provide the Replayed"],
    },
    // The content of the message
    Msg: {
        type: Object,
        required: [true, "Please provide the Msg"],
    },
    // Optional: Message Receipt
    MsgRct: Object,
    // Optional: Gas Cost associated with the message
    GasCost: Object,
})

// Define the Message model using the Message schema
const MessageModel =
    mongoose.models.Message ||
    mongoose.model<MessageDocument>("Message", MessageSchema)

// Export the Message model and document interface
export { MessageModel }
export type { MessageDocument }
