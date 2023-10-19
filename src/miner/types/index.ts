import { Account } from "../../basic/account/types"
import { Address } from "../../basic/address/types"
import { Balance } from "../../basic/balance/types"
import { Capacity, EnhanceNumber } from "@unipackage/utils"
import { Entity } from "@unipackage/ddd"

export interface MinerInfoProperties {
    Actor: Address
    Owner: Address
    Worker: Address
    Control: Array<Address>
    Beneficiary: Address
}

export class MinerInfo extends Entity<MinerInfoProperties> {}

export interface MinerBalanceProperties {
    Actor: Account
    ActorAvailable: Balance
    Owner: Account
    Worker: Account
    Control: Array<Account>
}
export class MinerBalance extends Entity<MinerBalanceProperties> {}

export interface PowerProperties {
    RawBytePower: Capacity
    QualityAdjPower: Capacity
}
export class Power extends Entity<PowerProperties> {}

export interface MinerPowerProperties {
    HasMinPower: boolean
    MinerPower: Power
    Percent: EnhanceNumber
    TotalPower: Power
}
export class MinerPower extends Entity<MinerPowerProperties> {}

export interface MinerProperties {
    Info: MinerInfo
    Balance: MinerBalance
    Power: MinerPower
}
export class Miner extends Entity<MinerProperties> {}
