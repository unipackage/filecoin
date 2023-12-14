import {
    FilecoinRPCEngine,
    withRequestMethod,
    RPCResponse,
    RPCOptions,
} from "@unipackage/net"
import {} from "@glif/filecoin-address"
import { LotusRpcEngineConfig } from "@glif/filecoin-rpc-client"
import { Tipset } from "../../../basic/tipset/types"
import { Actor } from "../../../basic/actor/types"
import { Capacity, EnhanceNumber } from "@unipackage/utils"
import { Balance, MarketBalance } from "../../../basic/balance/types"
import { Cid } from "../../../basic/cid/types"
import { Address } from "../../../basic/address/types"
import { MinerInfo, MinerPower, Power } from "../../types"
import { BigNumber } from "@glif/filecoin-number"

interface ParticipantFilecoinOriginRPC {
    ChainHead(): Promise<RPCResponse<Tipset>>

    StateGetActor(
        param: string,
        chainHead: Array<Cid>
    ): Promise<RPCResponse<any>>
    WalletBalance(param: string): Promise<RPCResponse<any>>
    StateMarketBalance(
        param: string,
        chainHead: Array<Cid>
    ): Promise<RPCResponse<any>>

    StateMinerInfo(
        param: string,
        chainHead: Array<Cid>
    ): Promise<RPCResponse<any>>
    StateAccountKey(
        param: string,
        chainHead: Array<Cid>
    ): Promise<RPCResponse<any>>
    StateMinerPower(
        param: string,
        chainHead: Array<Cid>
    ): Promise<RPCResponse<any>>
    StateMinerAvailableBalance(
        param: string,
        chainHead: Array<Cid>
    ): Promise<RPCResponse<any>>
}

@withRequestMethod([
    "ChainHead",
    "WalletBalance",
    "StateMinerAvailableBalance",
    "StateMarketBalance",
    "StateGetActor",
    "StateMinerInfo",
    "StateMinerPower",
    "StateAccountKey",
])
class ParticipantFilecoinOriginRPC extends FilecoinRPCEngine {}

export class ParticipantFilecoinRPC extends ParticipantFilecoinOriginRPC {
    public async WalletBalance(param: string): Promise<RPCResponse<Balance>> {
        const res = await super.WalletBalance(param)
        if (res.ok && res.data)
            res.data = new Balance(new BigNumber(res.data), "attofil")
        return res
    }
    public async StateMinerAvailableBalance(
        param: string,
        chainHead: Array<Cid>
    ): Promise<RPCResponse<Balance>> {
        const res = await super.StateMinerAvailableBalance(param, chainHead)
        if (res.ok && res.data)
            res.data = new Balance(new BigNumber(res.data), "attofil")
        return res
    }

    public async StateMarketBalance(
        param: string,
        chainHead: Array<Cid>
    ): Promise<RPCResponse<MarketBalance>> {
        const res = await super.StateMarketBalance(param, chainHead)
        if (res.ok && res.data)
            res.data = new MarketBalance({
                Escrow: new Balance(new BigNumber(res.data.Escrow), "attofil"),
                Locked: new Balance(new BigNumber(res.data.Locked), "attofil"),
            })
        return res
    }

    public async StateGetActor(
        param: string,
        chainHead: Array<Cid>
    ): Promise<RPCResponse<Actor>> {
        const res = await super.StateGetActor(param, chainHead)

        if (res.ok && res.data)
            res.data = new Actor({
                Code: res.data.Code,
                Head: res.data.Head,
                Nonce: res.data.Nonce,
                Balance: new Balance(
                    new BigNumber(res.data.Balance),
                    "attofil"
                ),
                Address: res.data.Address && new Address(res.data.Address),
            })
        return res
    }

    public async StateMinerInfo(
        param: string,
        chainHead: Array<Cid>
    ): Promise<RPCResponse<MinerInfo>> {
        const res = await super.StateMinerInfo(param, chainHead)
        if (res.ok && res.data)
            res.data = new MinerInfo({
                Actor: new Address(param),
                Owner: new Address(res.data.Owner),
                Worker: new Address(res.data.Worker),
                Control:
                    res.data.ControlAddresses &&
                    res.data.ControlAddresses.map(
                        (address: any) => new Address(address)
                    ),
                Beneficiary: new Address(res.data.Beneficiary),
            })
        return res
    }

    public async StateAccountKey(
        param: string,
        chainHead: Array<Cid>
    ): Promise<RPCResponse<Address>> {
        const res = await super.StateAccountKey(param, chainHead)
        if (res.ok && res.data) res.data = new Address(res.data)
        return res
    }

    public async StateMinerPower(
        param: string,
        chainHead: Array<Cid>
    ): Promise<RPCResponse<MinerPower>> {
        const res = await super.StateMinerPower(param, chainHead)
        if (res.ok && res.data)
            res.data = new MinerPower({
                HasMinPower: res.data.HasMinPower,
                Percent: new EnhanceNumber(
                    res.data.MinerPower.QualityAdjPower /
                        res.data.TotalPower.QualityAdjPower
                ),
                MinerPower: new Power({
                    RawBytePower: new Capacity(
                        res.data.MinerPower.RawBytePower
                    ),
                    QualityAdjPower: new Capacity(
                        res.data.MinerPower.QualityAdjPower
                    ),
                }),
                TotalPower: new Power({
                    RawBytePower: new Capacity(
                        res.data.TotalPower.RawBytePower
                    ),
                    QualityAdjPower: new Capacity(
                        res.data.TotalPower.QualityAdjPower
                    ),
                }),
            })
        return res
    }
}
