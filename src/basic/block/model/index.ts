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
import { BlockMessages } from "../types"
import { ValueFields } from "@unipackage/utils"

// Define the document interface for BlockMessages in Mongoose
interface BlockMessagesDocument extends ValueFields<BlockMessages>, Document {}

// Define the Mongoose schema for BlockMessages
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

// Create or reuse the Mongoose model for BlockMessages
const BlockMessagesModel =
    mongoose.models.BlockMessages ||
    mongoose.model<BlockMessagesDocument>("BlockMessages", BlockMessagesSchema)

// Export the Mongoose model and document interface
export { BlockMessagesModel }
export type { BlockMessagesDocument }
