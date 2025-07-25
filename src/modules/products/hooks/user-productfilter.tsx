import {  parseAsStringLiteral, useQueryStates } from "nuqs";
import { parseAsString,parseAsArrayOf } from "nuqs/server";

const sortValues=["curated","trending","hot_and_new"] as const

const params = {
    sort:parseAsStringLiteral(sortValues).withDefault("curated"),
    minprice: parseAsString
        .withOptions({
            clearOnDefault: true
        })
        .withDefault(""),
    maxprice: parseAsString

        .withOptions({
            clearOnDefault: true
        })
        .withDefault(""),

    tags: parseAsArrayOf(parseAsString)
        .withOptions(
            {
                clearOnDefault: true,
            }
        )
        .withDefault([])

}

export const useProductFilter = () => {
    return useQueryStates(params)
}