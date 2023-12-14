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

export class MessageMongoDatastore extends DataStore<
    ValueFields<Message>,
    MessageDocument
> {
    constructor(uri: string, options: DatabaseOptions) {
        super(
            new MongooseDataStore<ValueFields<Message>, MessageDocument>(
                MessageModel,
                uri,
                options
            )
        )
    }
    protected shouldUpdate(existingData: Message, newData: Message): boolean {
        if (existingData.Replayed === true) return false
        return super.shouldUpdate(existingData, newData, [
            "MsgCid",
            "Replayed",
        ] as (keyof ValueFields<Message>)[])
    }
}
export class BlockMongoDatastore extends DataStore<
    ValueFields<BlockMessages>,
    BlockMessagesDocument
> {
    constructor(uri: string, options: DatabaseOptions) {
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
        return super.shouldUpdate(existingData, newData, [
            "BlockCid",
        ] as (keyof ValueFields<BlockMessages>)[])
    }
}
export class TipsetMongoDatastore extends DataStore<
    ValueFields<Tipset>,
    TipsetDocument
> {
    constructor(uri: string, options: DatabaseOptions) {
        super(
            new MongooseDataStore<ValueFields<Tipset>, TipsetDocument>(
                TipsetModel,
                uri,
                options
            )
        )
    }
    protected shouldUpdate(existingData: Tipset, newData: Tipset): boolean {
        return super.shouldUpdate(existingData, newData, [
            "Height",
        ] as (keyof ValueFields<Tipset>)[])
    }
}
