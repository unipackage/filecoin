import { TipsetProperties } from "../../tipset/types"
import { BlockMessagesProperties } from "../../block/types"
import { BlsMessage, MessageProperties } from "../../message/types"

export function BlockMessagesToMessages(
    blockMessagesArray: BlockMessagesProperties[],
    tipset: TipsetProperties
): Array<MessageProperties> {
    const blockCidsInTipset = new Set<string>(
        tipset.Cids.map((cid) => JSON.stringify(cid))
    )
    const res: Array<MessageProperties> = []
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
        res.push({
            Height: tipset.Height,
            Replayed: false,
            Msg: value,
            MsgCid: value.CID,
        } as MessageProperties)
    })

    return res
}
