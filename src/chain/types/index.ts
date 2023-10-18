import { TipsetProperties } from "../../basic/tipset/types"
import { BlockMessagesProperties } from "../../basic/block/types"
import { MessageProperties } from "../../basic/message/types"

export interface ChainProperties {
    tipset: TipsetProperties
    blockMessagesArray: Array<BlockMessagesProperties>
    messages: Array<MessageProperties>
}
