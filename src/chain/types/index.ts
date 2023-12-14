import { Tipset } from "../../basic/tipset/types"
import { BlockMessages } from "../../basic/block/types"
import { Message } from "../../basic/message/types"
import { Entity } from "@unipackage/ddd"

export interface Chain {
    tipset: Tipset
    blockMessagesArray: Array<BlockMessages>
    messages: Array<Message>
}

export class Chain extends Entity<Chain> {}
