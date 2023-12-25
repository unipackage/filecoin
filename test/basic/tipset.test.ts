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

import { expect } from "chai"
import "mocha"
import { Tipset } from "../../src/basic/tipset/types" // Replace with the actual path to your TypeScript file

describe("Tipset Entity", () => {
    it("should create a valid Tipset entity", () => {
        const tipsetData = new Tipset({
            Height: 1,
            Cids: [],
            Blocks: [],
        })

        const tipsetEntity = new Tipset(tipsetData)

        expect(tipsetEntity).to.be.an.instanceOf(Tipset)
    })
})
