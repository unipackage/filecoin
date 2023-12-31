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

import DatasetProofAbi from "../testAbi/DatasetsProof.json"
import { Evm, EthersEvmEngine } from "@unipackage/net"
import * as dotenv from "dotenv"
dotenv.config()

/**
 * Instance of EthersProof initialized with provided configuration.
 */
export const proofEvm = new Evm(
    new EthersEvmEngine(
        DatasetProofAbi.abi,
        process.env.PROOF_CONTRACT_ADDRESS as string,
        process.env.PROVIDER_URL as string
    )
)
