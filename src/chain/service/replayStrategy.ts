import { Message } from "../../basic/message/types"

export interface ReplayStrategy {
    shouldReplay(message: Message): boolean
}

export interface ReplayStrategyOptions {
    replay?: boolean
    replayStrategy?: ReplayStrategy
}

export class AddressesFilterReplayStrategy implements ReplayStrategy {
    private addresses: string[]

    constructor(addresses: string[]) {
        this.addresses = addresses
    }

    shouldReplay(message: Message): boolean {
        return (
            this.addresses.includes(message.Msg.From) ||
            this.addresses.includes(message.Msg.To)
        )
    }
}

export class AllReplayStrategy implements ReplayStrategy {
    shouldReplay(message: Message): boolean {
        return true
    }
}

export const DefaultReplayStrategy = {
    replay: true,
    replayStrategy: new AllReplayStrategy(),
}
