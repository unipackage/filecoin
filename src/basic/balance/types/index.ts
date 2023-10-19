import { FilecoinNumber } from "@glif/filecoin-number"
import { EnhanceNumber } from "@unipackage/utils"
import { Entity } from "@unipackage/ddd"

export class Balance extends FilecoinNumber {
    toEnhanceNumberFil(): EnhanceNumber {
        return new EnhanceNumber(Number(this.toFil()))
    }
}

export interface MarketBalanceProperties {
    Escrow: Balance
    Locked: Balance
}

export class MarketBalance extends Entity<MarketBalanceProperties> {}
