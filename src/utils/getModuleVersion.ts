import path from "path";
import {fileURLToPath} from "url";
import fs from "fs-extra";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let moduleVersion: string | null = null;
export async function getModuleVersion(): Promise<string> {
    if (moduleVersion != null)
        return moduleVersion;

    const packageJson = await fs.readJson(path.join(__dirname, "..", "..", "package.json"));

    // Milady fork: the prebuilt binary packages on npm are versioned to
    // the upstream release (e.g. "3.18.1"), not our fork suffix
    // ("3.18.1-milady.2"). `getPrebuiltBinariesPackageDirectoryForBuildOptions`
    // in compileLLamaCpp.ts refuses to use a binary unless its package
    // version === the consumer's package version. To stay a drop-in for
    // upstream prebuilds, strip the "-milady.N" suffix when comparing
    // against binary package versions. The full version (with suffix)
    // remains on package.json so consumers can detect they're on the fork.
    const rawVersion = packageJson.version as string;
    moduleVersion = rawVersion.replace(/-milady\.\d+$/, "");

    return moduleVersion;
}
