import { Tipset } from "../../tipset/types"
import { BlockMessages } from "../../block/types"
import { Message } from "../../message/types"
import { Entities } from "@unipackage/ddd"

export interface Chain {
    tipset: Tipset
    blockMessagesArray: Entities<BlockMessages>
    messages: Entities<Message>
}
