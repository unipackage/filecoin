import { DataStore } from "@unipackage/datastore"
import { MessageProperties } from "../../../message/types"
import { BlockMessagesProperties } from "../../../block/types"
import { TipsetProperties } from "../../../tipset/types"
import { MessageModel, MessageDocument } from "../../../message/model"
import { BlockMessagesDocument, BlockMessagesModel } from "../../../block/model"
import { TipsetDocument, TipsetModel } from "../../../tipset/model"
import { MongooseDataStore } from "@unipackage/datastore"

class ChainDatastore<
    T extends MessageProperties | BlockMessagesProperties | TipsetProperties,
    U
> extends DataStore<T, U> {}

export class MessageMongoDatastore extends ChainDatastore<
    MessageProperties,
    MessageDocument
> {
    constructor(uri: string) {
        super(
            new MongooseDataStore<MessageProperties, MessageDocument>(
                MessageModel,
                uri
            )
        )
    }
    protected shouldUpdate(
        existingData: MessageProperties,
        newData: MessageProperties
    ): boolean {
        if (existingData.Replayed === true) return false
        return super.shouldUpdate(existingData, newData, [
            "MsgCid",
            "Replayed",
        ] as (keyof MessageProperties)[])
    }
}
export class BlockMongoDatastore extends ChainDatastore<
    BlockMessagesProperties,
    BlockMessagesDocument
> {
    constructor(uri: string) {
        super(
            new MongooseDataStore<
                BlockMessagesProperties,
                BlockMessagesDocument
            >(BlockMessagesModel, uri)
        )
    }
    protected shouldUpdate(
        existingData: BlockMessagesProperties,
        newData: BlockMessagesProperties
    ): boolean {
        return super.shouldUpdate(existingData, newData, [
            "BlockCid",
        ] as (keyof BlockMessagesProperties)[])
    }
}
export class TipsetMongoDatastore extends ChainDatastore<
    TipsetProperties,
    TipsetDocument
> {
    constructor(uri: string) {
        super(
            new MongooseDataStore<TipsetProperties, TipsetDocument>(
                TipsetModel,
                uri
            )
        )
    }
    protected shouldUpdate(
        existingData: TipsetProperties,
        newData: TipsetProperties
    ): boolean {
        return super.shouldUpdate(existingData, newData, [
            "Height",
        ] as (keyof TipsetProperties)[])
    }
}
