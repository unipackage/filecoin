import { FilecoinNumber, FilecoinDenomination } from "@glif/filecoin-number"
import { EnhanceNumber } from "@unipackage/utils"
import { Entity } from "@unipackage/ddd"

export class Balance extends FilecoinNumber {
    toEnhanceNumberFil(denomination: FilecoinDenomination): EnhanceNumber {
        switch (denomination) {
            case "attofil":
                return new EnhanceNumber(Number(this.toAttoFil()))
            case "picofil":
                return new EnhanceNumber(Number(this.toPicoFil()))
            case "fil":
                return new EnhanceNumber(Number(this.toFil()))
            default:
                return new EnhanceNumber(Number(this.toFil()))
        }
    }
}

export interface MarketBalance {
    Escrow: Balance
    Locked: Balance
}

export class MarketBalance extends Entity<MarketBalance> {}
