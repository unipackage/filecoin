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

export interface Example {
    boolElement: boolean
    stringElement: string
    numberElement: number
    objectElement: {
        boolElement: boolean
        stringElement: string
        numberElement: number
    }
    arrayElement: Array<any>
}

export const generateExpample = (
    numberValue: number,
    stringValue: string,
    boolValue: boolean
): Example => {
    return {
        numberElement: numberValue,
        boolElement: boolValue,
        stringElement: stringValue,
        objectElement: {
            boolElement: boolValue,
            numberElement: numberValue,
            stringElement: stringValue,
        },
        arrayElement: [numberValue, stringValue],
    }
}
