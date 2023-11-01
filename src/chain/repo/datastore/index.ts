import { DataStore } from "@unipackage/datastore"
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
import { TypeFromProperties } from "@unipackage/utils"

export class MessageMongoDatastore extends DataStore<
    TypeFromProperties<Message>,
    MessageDocument
> {
    constructor(uri: string) {
        super(
            new MongooseDataStore<TypeFromProperties<Message>, MessageDocument>(
                MessageModel,
                uri
            )
        )
    }
    protected shouldUpdate(existingData: Message, newData: Message): boolean {
        if (existingData.Replayed === true) return false
        return super.shouldUpdate(existingData, newData, [
            "MsgCid",
            "Replayed",
        ] as (keyof TypeFromProperties<Message>)[])
    }
}
export class BlockMongoDatastore extends DataStore<
    TypeFromProperties<BlockMessages>,
    BlockMessagesDocument
> {
    constructor(uri: string) {
        super(
            new MongooseDataStore<
                TypeFromProperties<BlockMessages>,
                BlockMessagesDocument
            >(BlockMessagesModel, uri)
        )
    }
    protected shouldUpdate(
        existingData: BlockMessages,
        newData: BlockMessages
    ): boolean {
        return super.shouldUpdate(existingData, newData, [
            "BlockCid",
        ] as (keyof TypeFromProperties<BlockMessages>)[])
    }
}
export class TipsetMongoDatastore extends DataStore<
    TypeFromProperties<Tipset>,
    TipsetDocument
> {
    constructor(uri: string) {
        super(
            new MongooseDataStore<TypeFromProperties<Tipset>, TipsetDocument>(
                TipsetModel,
                uri
            )
        )
    }
    protected shouldUpdate(existingData: Tipset, newData: Tipset): boolean {
        return super.shouldUpdate(existingData, newData, [
            "Height",
        ] as (keyof TypeFromProperties<Tipset>)[])
    }
}
