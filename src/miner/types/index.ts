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

import { Account } from "../../basic/account/types"
import { Address } from "../../basic/address/types"
import { Balance } from "../../basic/balance/types"
import { Capacity, EnhanceNumber } from "@unipackage/utils"
import { Entity } from "@unipackage/ddd"

/**
 * Represents information about a Filecoin miner.
 */
export interface MinerInfo {
    Actor: Address
    Owner: Address
    Worker: Address
    Control: Array<Address>
    Beneficiary: Address
}

/**
 * Entity class for MinerInfo.
 */
export class MinerInfo extends Entity<MinerInfo> {}

/**
 * Represents the balance information of a Filecoin miner.
 */
export interface MinerBalance {
    Actor: Account
    ActorAvailable: Balance
    Owner: Account
    Worker: Account
    Control: Array<Account>
}

/**
 * Entity class for MinerBalance.
 */
export class MinerBalance extends Entity<MinerBalance> {}

/**
 * Represents power-related information of a Filecoin miner.
 */
export interface Power {
    RawBytePower: Capacity
    QualityAdjPower: Capacity
}

/**
 * Entity class for Power.
 */
export class Power extends Entity<Power> {}

/**
 * Represents the power and balance information of a Filecoin miner.
 */
export interface MinerPower {
    HasMinPower: boolean
    MinerPower: Power
    Percent: EnhanceNumber
    TotalPower: Power
}

/**
 * Entity class for MinerPower.
 */
export class MinerPower extends Entity<MinerPower> {}

/**
 * Represents a Filecoin miner, combining information about the miner's identity, balance, and power.
 */
export interface Miner {
    Info: MinerInfo
    Balance: MinerBalance
    Power: MinerPower
}

/**
 * Entity class for Miner.
 */
export class Miner extends Entity<Miner> {}
