const PNPM_INNER_TOKEN = '<PNPM_INNER>';
const PNPM_INNER_DELIMITERS = /[\s!"']/;

// local virtual store: .pnpm/<pkg>@<ver>/node_modules
const LOCAL_PNPM_POSIX = /(?<=\/)(\.pnpm\/.+?\/node_modules)(?=\/)/g;
const LOCAL_PNPM_WIN32 = /(?<=\\)(\.pnpm\\.+?\\node_modules)(?=\\)/g;
// global virtual store: pnpm/store/<versions>/links/<pkg>/<ver>/<hash>/node_modules
const GLOBAL_PNPM_POSIX =
  /(?<=\/)pnpm\/store\/.+?\/links\/.+?\/node_modules(?=\/)/g;

/**
 * Replace pnpm virtual store paths with `<PNPM_INNER>` and strip
 * the environment-dependent prefix so that local virtual store
 * and global virtual store both normalize to `<PNPM_INNER>/pkg/...`.
 */
export function replacePnpmInnerPath(str: string): string {
  const replaced = str
    .replace(LOCAL_PNPM_POSIX, PNPM_INNER_TOKEN)
    .replace(LOCAL_PNPM_WIN32, PNPM_INNER_TOKEN)
    .replace(GLOBAL_PNPM_POSIX, PNPM_INNER_TOKEN);

  // Strip environment-dependent prefix before <PNPM_INNER>
  // e.g. <ROOT>/node_modules/<PNPM_INNER> → <PNPM_INNER>
  // Uses string splitting instead of regex to avoid ReDoS.
  const parts = replaced.split(PNPM_INNER_TOKEN);
  if (parts.length <= 1) return replaced;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    let j = part.length - 1;
    while (j >= 0 && !PNPM_INNER_DELIMITERS.test(part[j])) {
      j--;
    }
    parts[i] = part.substring(0, j + 1);
  }

  return parts.join(PNPM_INNER_TOKEN);
}
