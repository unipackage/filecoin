/*******************************************************************************
 *   (c) 2023 unipackage
 *
 *  Licensed under either the MIT License (the "MIT License") or the Apache License, Version 2.0
 *  (the "Apache License"). You may not use this file except in compliance with one of these
 *  licenses. You may obtain a copy of the MIT License at
 *
 *      https://opensource.org/licenses/MIT
 *
 *  Or the Apache License, Version 2.0 at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the MIT License or the Apache License for the specific language governing permissions and
 *  limitations under the respective licenses.
 ********************************************************************************/

import {
    FilecoinRPCEngine,
    withRequestMethod,
    RPCResponse,
} from "@unipackage/net"
import {} from "@glif/filecoin-address"
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
    /**
     * Retrieves the current tipset from the Filecoin chain.
     * @returns A Promise that resolves to a Result containing the current tipset or an error.
     */
    public async ChainHead(): Promise<RPCResponse<Tipset>> {
        return super.ChainHead()
    }

    /**
     * Retrieves information about a Filecoin actor.
     * @param param - The actor's address.
     * @param chainHead - The CIDs of the blocks in the current tipset.
     * @returns A Promise that resolves to a Result containing the actor's information or an error.
     */
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

    /**
     * Retrieves the balance of a Filecoin wallet.
     * @param param - The wallet's address.
     * @returns A Promise that resolves to a Result containing the wallet balance or an error.
     */
    public async WalletBalance(param: string): Promise<RPCResponse<Balance>> {
        const res = await super.WalletBalance(param)
        if (res.ok && res.data)
            res.data = new Balance(new BigNumber(res.data), "attofil")
        return res
    }

    /**
     * Retrieves the market balance of a Filecoin address.
     * @param param - The address to query.
     * @param chainHead - The CIDs of the blocks in the current tipset.
     * @returns A Promise that resolves to a Result containing the market balance or an error.
     */
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

    /**
     * Retrieves information about a Filecoin miner.
     * @param param - The miner's address.
     * @param chainHead - The CIDs of the blocks in the current tipset.
     * @returns A Promise that resolves to a Result containing the miner's information or an error.
     */
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

    /**
     * Retrieves the account key of a Filecoin address.
     * @param param - The address to query.
     * @param chainHead - The CIDs of the blocks in the current tipset.
     * @returns A Promise that resolves to a Result containing the account key or an error.
     */
    public async StateAccountKey(
        param: string,
        chainHead: Array<Cid>
    ): Promise<RPCResponse<Address>> {
        const res = await super.StateAccountKey(param, chainHead)
        if (res.ok && res.data) res.data = new Address(res.data)
        return res
    }

    /**
     * Retrieves power-related information about a Filecoin miner.
     * @param param - The miner's address.
     * @param chainHead - The CIDs of the blocks in the current tipset.
     * @returns A Promise that resolves to a Result containing the miner's power information or an error.
     */
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

    /**
     * Retrieves the available balance of a Filecoin miner.
     * @param param - The miner's address.
     * @param chainHead - The CIDs of the blocks in the current tipset.
     * @returns A Promise that resolves to a Result containing the available balance or an error.
     */
    public async StateMinerAvailableBalance(
        param: string,
        chainHead: Array<Cid>
    ): Promise<RPCResponse<Balance>> {
        const res = await super.StateMinerAvailableBalance(param, chainHead)
        if (res.ok && res.data)
            res.data = new Balance(new BigNumber(res.data), "attofil")
        return res
    }
}
