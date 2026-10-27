// Keep app routes independent of the hosting directory (e.g. /claux-cv/).
const base = import.meta.env.BASE_URL.replace(/\/$/, "");

export function sitePath(path: string) {
  return `${base}${path}`;
}

export function appPath(pathname: string) {
  if (base && (pathname === base || pathname.startsWith(`${base}/`))) {
    return pathname.slice(base.length) || "/";
  }
  return pathname;
}
