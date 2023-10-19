import {
    Address as GlifAddress,
    Protocol,
    CoinType,
} from "@glif/filecoin-address"
import { Result } from "@unipackage/utils"

export class Address extends GlifAddress {
    private idAddress

    constructor(bytes: Uint8Array | string, coinType?: CoinType) {
        if (typeof bytes === "string") {
            const encoder = new TextEncoder()
            super(encoder.encode(bytes), coinType)
        } else {
            super(bytes, coinType)
        }
        this.idAddress = super.protocol() == Protocol.ID ? this.toString() : ""
    }

    getIdAddress(): Result<string> {
        return this.idAddress !== ""
            ? {
                  ok: true,
                  data: this.idAddress,
              }
            : {
                  ok: false,
                  error: "IdAddress not setted",
              }
    }

    setIdAddress(idAddress: string): Result<void> {
        if (this.idAddress !== "") {
            this.idAddress = idAddress
            return {
                ok: true,
            }
        }
        return {
            ok: false,
            error: "Id Address is alreay setted! ",
        }
    }
}
