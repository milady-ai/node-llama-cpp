export var GgmlType;
(function (GgmlType) {
    GgmlType[GgmlType["F32"] = 0] = "F32";
    GgmlType[GgmlType["F16"] = 1] = "F16";
    GgmlType[GgmlType["Q4_0"] = 2] = "Q4_0";
    GgmlType[GgmlType["Q4_1"] = 3] = "Q4_1";
    GgmlType[GgmlType["Q4_2"] = 4] = "Q4_2";
    GgmlType[GgmlType["Q4_3"] = 5] = "Q4_3";
    GgmlType[GgmlType["Q5_0"] = 6] = "Q5_0";
    GgmlType[GgmlType["Q5_1"] = 7] = "Q5_1";
    GgmlType[GgmlType["Q8_0"] = 8] = "Q8_0";
    GgmlType[GgmlType["Q8_1"] = 9] = "Q8_1";
    GgmlType[GgmlType["Q2_K"] = 10] = "Q2_K";
    GgmlType[GgmlType["Q3_K"] = 11] = "Q3_K";
    GgmlType[GgmlType["Q4_K"] = 12] = "Q4_K";
    GgmlType[GgmlType["Q5_K"] = 13] = "Q5_K";
    GgmlType[GgmlType["Q6_K"] = 14] = "Q6_K";
    GgmlType[GgmlType["Q8_K"] = 15] = "Q8_K";
    GgmlType[GgmlType["IQ2_XXS"] = 16] = "IQ2_XXS";
    GgmlType[GgmlType["IQ2_XS"] = 17] = "IQ2_XS";
    GgmlType[GgmlType["IQ3_XXS"] = 18] = "IQ3_XXS";
    GgmlType[GgmlType["IQ1_S"] = 19] = "IQ1_S";
    GgmlType[GgmlType["IQ4_NL"] = 20] = "IQ4_NL";
    GgmlType[GgmlType["IQ3_S"] = 21] = "IQ3_S";
    GgmlType[GgmlType["IQ2_S"] = 22] = "IQ2_S";
    GgmlType[GgmlType["IQ4_XS"] = 23] = "IQ4_XS";
    GgmlType[GgmlType["I8"] = 24] = "I8";
    GgmlType[GgmlType["I16"] = 25] = "I16";
    GgmlType[GgmlType["I32"] = 26] = "I32";
    GgmlType[GgmlType["I64"] = 27] = "I64";
    GgmlType[GgmlType["F64"] = 28] = "F64";
    GgmlType[GgmlType["IQ1_M"] = 29] = "IQ1_M";
    GgmlType[GgmlType["BF16"] = 30] = "BF16";
    GgmlType[GgmlType["Q4_0_4_4"] = 31] = "Q4_0_4_4";
    GgmlType[GgmlType["Q4_0_4_8"] = 32] = "Q4_0_4_8";
    GgmlType[GgmlType["Q4_0_8_8"] = 33] = "Q4_0_8_8";
    GgmlType[GgmlType["TQ1_0"] = 34] = "TQ1_0";
    GgmlType[GgmlType["TQ2_0"] = 35] = "TQ2_0";
    GgmlType[GgmlType["IQ4_NL_4_4"] = 36] = "IQ4_NL_4_4";
    GgmlType[GgmlType["IQ4_NL_4_8"] = 37] = "IQ4_NL_4_8";
    GgmlType[GgmlType["IQ4_NL_8_8"] = 38] = "IQ4_NL_8_8";
    GgmlType[GgmlType["MXFP4"] = 39] = "MXFP4";
    GgmlType[GgmlType["NVFP4"] = 40] = "NVFP4";
    // Milady-controlled fork additions (milady-ai/llama.cpp @ v0.1.0-milady).
    // Slot allocation matches the unified fork's ggml.h:
    //   41 reserved (apothic uses Q1_0_g128 here, not yet exposed by node binding)
    //   42 reserved (apothic uses Q1_0 here, not yet exposed by node binding)
    //   43 TBQ3_0   - 3-bit TurboQuant V-cache (apothic/llama.cpp-1bit-turboquant)
    //   44 TBQ4_0   - 4-bit TurboQuant V-cache (apothic/llama.cpp-1bit-turboquant)
    //   45 reserved (intentional hole — was GGML_TYPE_COUNT in TBQ-only build)
    //   46 QJL1_256 - 1-bit JL-transform K-cache (W1-A QJL series)
    //   47 Q4_POLAR - 4-bit PolarQuant weights (W1-B Polar series)
    //
    // Lowercase aliases (`tbq3_0`, `tbq4_0`, `qjl1_256`, `q4_polar`) are
    // also resolved by `resolveGgmlTypeOption()` below so consumers can
    // pass the same strings the AOSP `aosp-llama-adapter.ts` uses.
    GgmlType[GgmlType["TBQ3_0"] = 43] = "TBQ3_0";
    GgmlType[GgmlType["TBQ4_0"] = 44] = "TBQ4_0";
    GgmlType[GgmlType["QJL1_256"] = 46] = "QJL1_256";
    GgmlType[GgmlType["Q4_POLAR"] = 47] = "Q4_POLAR";
})(GgmlType || (GgmlType = {}));
// Lowercase string aliases for the Milady-fork additions. The base llama.cpp
// enum keys are uppercase (Q4_0, F16, ...), but the milady consumer side
// already standardized on lowercase ("tbq3_0", "qjl1_256", "q4_polar") via
// `KvCacheTypeName` in `aosp-llama-adapter.ts`. Resolving both forms here
// means callers don't have to translate when crossing the desktop/mobile
// boundary.
const ggmlTypeAliases = {
    tbq3_0: GgmlType.TBQ3_0,
    tbq4_0: GgmlType.TBQ4_0,
    // tbq3_tcq is not yet a separate ggml type — it's a sub-mode of TBQ3_0
    // resolved at runtime by the kernel dispatcher (see milady-fork's
    // ggml-cpu/quants.c). Map it to TBQ3_0 here so consumer config files
    // that say "tbq3_tcq" don't get rejected at validation.
    tbq3_tcq: GgmlType.TBQ3_0,
    qjl1_256: GgmlType.QJL1_256,
    q4_polar: GgmlType.Q4_POLAR
};
export function resolveGgmlTypeOption(option) {
    if (option == null)
        return undefined;
    if (typeof option === "number" && Object.hasOwn(GgmlType, option))
        return option;
    else if (typeof option === "string") {
        if (Object.hasOwn(GgmlType, option))
            return GgmlType[option];
        // Milady-fork lowercase aliases (`tbq3_0`, `qjl1_256`, etc.).
        if (Object.hasOwn(ggmlTypeAliases, option))
            return ggmlTypeAliases[option];
    }
    return undefined;
}
//# sourceMappingURL=GgufTensorInfoTypes.js.map