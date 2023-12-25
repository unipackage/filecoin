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

import { DataStore, DatabaseOptions } from "@unipackage/datastore"
import { Message } from "../../../basic/message/types"
import { BlockMessages } from "../../../basic/block/types"
import { Tipset } from "../../../basic/tipset/types"
import { MessageModel, MessageDocument } from "../../../basic/message/model"
import {
    BlockMessagesDocument,
    BlockMessagesModel,
} from "../../../basic/block/model"
import { TipsetDocument, TipsetModel } from "../../../basic/tipset/model"
import { MongooseDataStore } from "@unipackage/datastore"
import { ValueFields } from "@unipackage/utils"

/**
 * DataStore implementation for handling Message entities using MongoDB.
 */
export class MessageMongoDatastore extends DataStore<
    ValueFields<Message>,
    MessageDocument
> {
    constructor(uri: string, options?: DatabaseOptions) {
        super(
            new MongooseDataStore<ValueFields<Message>, MessageDocument>(
                MessageModel,
                uri,
                options
            )
        )
    }

    protected shouldUpdate(existingData: Message, newData: Message): boolean {
        // Do not update if the message has already been replayed
        if (existingData.Replayed === true) return false

        // Call the base class implementation with specific fields to check for updates
        return super.shouldUpdate(existingData, newData, [
            "MsgCid",
            "Replayed",
        ] as (keyof ValueFields<Message>)[])
    }
}

/**
 * DataStore implementation for handling BlockMessages entities using MongoDB.
 */
export class BlockMongoDatastore extends DataStore<
    ValueFields<BlockMessages>,
    BlockMessagesDocument
> {
    constructor(uri: string, options?: DatabaseOptions) {
        super(
            new MongooseDataStore<
                ValueFields<BlockMessages>,
                BlockMessagesDocument
            >(BlockMessagesModel, uri, options)
        )
    }

    protected shouldUpdate(
        existingData: BlockMessages,
        newData: BlockMessages
    ): boolean {
        // Call the base class implementation with specific fields to check for updates
        return super.shouldUpdate(existingData, newData, [
            "BlockCid",
        ] as (keyof ValueFields<BlockMessages>)[])
    }
}

/**
 * DataStore implementation for handling Tipset entities using MongoDB.
 */
export class TipsetMongoDatastore extends DataStore<
    ValueFields<Tipset>,
    TipsetDocument
> {
    constructor(uri: string, options?: DatabaseOptions) {
        super(
            new MongooseDataStore<ValueFields<Tipset>, TipsetDocument>(
                TipsetModel,
                uri,
                options
            )
        )
    }

    protected shouldUpdate(existingData: Tipset, newData: Tipset): boolean {
        // Call the base class implementation with specific fields to check for updates
        return super.shouldUpdate(existingData, newData, [
            "Height",
        ] as (keyof ValueFields<Tipset>)[])
    }
}
