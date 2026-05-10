# @milady-ai/node-llama-cpp — Milady fork

This is a Milady-controlled fork of [`node-llama-cpp`](https://github.com/withcatai/node-llama-cpp)
v3.18.1 that extends the `GgmlType` enum so the new quantization types
shipped by [`milady-ai/llama.cpp`](https://github.com/milady-ai/llama.cpp)
can be passed to `experimentalKvCacheKeyType` /
`experimentalKvCacheValueType` without the binding rejecting them.

## What changed vs upstream v3.18.1

`src/gguf/types/GgufTensorInfoTypes.ts`:
- `GgmlType` enum gains four entries:
  - `TBQ3_0 = 43` (3-bit TurboQuant V-cache; apothic/llama.cpp-1bit-turboquant)
  - `TBQ4_0 = 44` (4-bit TurboQuant V-cache; apothic/llama.cpp-1bit-turboquant)
  - `QJL1_256 = 46` (1-bit JL-transform K-cache; W1-A QJL series)
  - `Q4_POLAR = 47` (4-bit PolarQuant weights; W1-B Polar series)
- `resolveGgmlTypeOption()` now also accepts the lowercase aliases
  `"tbq3_0"`, `"tbq4_0"`, `"tbq3_tcq"`, `"qjl1_256"`, `"q4_polar"` —
  the same strings the AOSP path's `aosp-llama-adapter.ts` uses for
  `KvCacheTypeName`. `tbq3_tcq` resolves to `TBQ3_0` since the TCQ
  variant is a runtime sub-mode of the same ggml type, not a separate
  type.

`src/evaluator/LlamaContext/types.ts`:
- `experimentalKvCacheKeyType` and `experimentalKvCacheValueType`
  parameter types widened to accept the new lowercase aliases.

`package.json`:
- Renamed `name` to `@milady-ai/node-llama-cpp`.
- Version pinned at `3.18.1-milady.1`.

## What did NOT change

The C++ binding (`llama/addon/AddonContext.cpp`) was already
correct — it validates `keyType < GGML_TYPE_COUNT` against whatever
ggml header the binding compiles with. As long as the binding is
built against `milady-ai/llama.cpp @ v0.1.0-milady` (where
`GGML_TYPE_COUNT = 48`), values 43, 44, 46, 47 all pass through to
`llama_context_params.type_k` / `type_v` without modification.

Slot 45 is an intentional reserved hole on the milady fork (it was
`GGML_TYPE_COUNT` in the TBQ-only build, kept as a hole so a GGUF that
recorded `type=45` against the older fork is unambiguously not a
recognized milady block). Passing 45 to `experimentalKvCacheKeyType`
will pass the `< GGML_TYPE_COUNT` check but hit a null type-trait
entry at runtime — don't do it.

## Maintenance

Rebase on `withcatai/node-llama-cpp` upstream `main` whenever they
ship a new release; the diff is small (one enum extension + one alias
table + one type widening) and should pick up upstream conflict-free.

The bundled C++ source under `llama/` continues to track upstream's
own llama.cpp pin. Consumers that want to use the milady-ai fork's
kernels need to either:

(a) build the binding against `milady-ai/llama.cpp @ v0.1.0-milady`
    via `LLAMA_CPP_REPO=https://github.com/milady-ai/llama.cpp
    LLAMA_CPP_REF=v0.1.0-milady npm install --rebuild`, or
(b) set up a build hook so `node-llama-cpp` consumes a pre-built
    `libllama.so` family from the milady artifact tree at
    `~/.cache/eliza-android-agent/...` (the AOSP-style path).

See `compile-libllama.mjs` and `build-llama-cpp-dflash.mjs` in the
milady consumer repo for the canonical build flow.
