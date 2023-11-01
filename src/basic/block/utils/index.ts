import { Tipset } from "../../tipset/types"
import { BlockMessages } from "../../block/types"
import { BlsMessage, Message } from "../../message/types"

export function BlockMessagesToMessages(
    blockMessagesArray: BlockMessages[],
    tipset: Tipset
): Array<Message> {
    const blockCidsInTipset = new Set<string>(
        tipset.Cids.map((cid) => JSON.stringify(cid))
    )
    const res: Array<Message> = []
    const messagesMap = new Map<string, BlsMessage>()

    for (const blockMessages of blockMessagesArray) {
        const blockCidString = JSON.stringify(blockMessages.BlockCid)
        if (!blockCidsInTipset.has(blockCidString)) {
            throw new Error(
                `Block ${blockCidString} is not in the tipset with height ${tipset.Height}`
            )
        }

        for (const bm of blockMessages.BlsMessages) {
            messagesMap.set(JSON.stringify(bm.CID), bm)
        }

        for (const sm of blockMessages.SecpkMessages) {
            const message = { ...sm.Message, CID: sm.CID }
            messagesMap.set(JSON.stringify(sm.CID), message)
        }
    }

    messagesMap.forEach((value) => {
        res.push(
            new Message({
                Height: tipset.Height,
                Replayed: false,
                Msg: value,
                MsgCid: value.CID,
            })
        )
    })

    return res
}
