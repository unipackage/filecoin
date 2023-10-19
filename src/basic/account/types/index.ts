import { FilecoinDenomination } from "@glif/filecoin-number"
import { Address } from "@glif/filecoin-address"
import { Balance, MarketBalance } from "../../balance/types"
import { Entity } from "@unipackage/ddd"

export interface AccountProperties {
    Address: Address
    Balance: Balance
    Marketbalance: MarketBalance
}

export class Account extends Entity<AccountProperties> {
    marketEscrowBalance(denomination: FilecoinDenomination): Balance {
        return new Balance(
            this.properties.Marketbalance.properties.Escrow,
            denomination
        )
    }
    marketLockedBalance(denomination: FilecoinDenomination): Balance {
        return new Balance(
            this.properties.Marketbalance.properties.Locked,
            denomination
        )
    }
    basicBalance(denomination: FilecoinDenomination): Balance {
        return new Balance(this.properties.Balance, denomination)
    }

    totalBalance(denomination: FilecoinDenomination): Balance {
        return new Balance(
            this.basicBalance(denomination)
                .plus(this.marketEscrowBalance(denomination))
                .plus(this.marketLockedBalance(denomination)),
            denomination
        )
    }
    availableBalance(denomination: FilecoinDenomination): Balance {
        return new Balance(
            this.basicBalance(denomination).plus(
                this.marketEscrowBalance(denomination)
            ),
            denomination
        )
    }
}
