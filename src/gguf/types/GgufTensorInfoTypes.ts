export type GgufTensorInfo = {
    readonly name: string,
    readonly dimensions: readonly (number | bigint)[],
    readonly ggmlType: GgmlType,
    readonly offset: number | bigint,

    /**
     * Adjusted offset relative to the file.
     *
     * Added by the GGUF parser - not part of the file's metadata.
     */
    readonly fileOffset: number | bigint,

    /**
     * For spliced metadata of multiple file parts, this will be the file part number.
     * Starts from `1`.
     *
     * Added by the GGUF parser - not part of the file's metadata.
     */
    readonly filePart: number
};

export enum GgmlType {
    F32 = 0,
    F16 = 1,
    Q4_0 = 2,
    Q4_1 = 3,
    Q4_2 = 4,
    Q4_3 = 5,
    Q5_0 = 6,
    Q5_1 = 7,
    Q8_0 = 8,
    Q8_1 = 9,
    Q2_K = 10,
    Q3_K = 11,
    Q4_K = 12,
    Q5_K = 13,
    Q6_K = 14,
    Q8_K = 15,
    IQ2_XXS = 16,
    IQ2_XS = 17,
    IQ3_XXS = 18,
    IQ1_S = 19,
    IQ4_NL = 20,
    IQ3_S = 21,
    IQ2_S = 22,
    IQ4_XS = 23,
    I8 = 24,
    I16 = 25,
    I32 = 26,
    I64 = 27,
    F64 = 28,
    IQ1_M = 29,
    BF16 = 30,
    Q4_0_4_4 = 31,
    Q4_0_4_8 = 32,
    Q4_0_8_8 = 33,
    TQ1_0 = 34,
    TQ2_0 = 35,
    IQ4_NL_4_4 = 36,
    IQ4_NL_4_8 = 37,
    IQ4_NL_8_8 = 38,
    MXFP4 = 39, // MXFP4 (1 block)
    NVFP4 = 40, // NVFP4 (4 blocks, E4M3 scale)

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
    TBQ3_0 = 43,
    TBQ4_0 = 44,
    QJL1_256 = 46,
    Q4_POLAR = 47
}

// Lowercase string aliases for the Milady-fork additions. The base llama.cpp
// enum keys are uppercase (Q4_0, F16, ...), but the milady consumer side
// already standardized on lowercase ("tbq3_0", "qjl1_256", "q4_polar") via
// `KvCacheTypeName` in `aosp-llama-adapter.ts`. Resolving both forms here
// means callers don't have to translate when crossing the desktop/mobile
// boundary.
const ggmlTypeAliases: Record<string, GgmlType> = {
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

export function resolveGgmlTypeOption(option?: keyof typeof GgmlType | GgmlType | string) {
    if (option == null)
        return undefined;

    if (typeof option === "number" && Object.hasOwn(GgmlType, option))
        return option as GgmlType;
    else if (typeof option === "string") {
        if (Object.hasOwn(GgmlType, option))
            return GgmlType[option as keyof typeof GgmlType];
        // Milady-fork lowercase aliases (`tbq3_0`, `qjl1_256`, etc.).
        if (Object.hasOwn(ggmlTypeAliases, option))
            return ggmlTypeAliases[option];
    }

    return undefined;
}
