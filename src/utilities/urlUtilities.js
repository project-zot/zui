// React Router route params are decoded once by the router itself. When a
// path segment has been percent-encoded more than once (e.g. a repo name
// containing '/' that went through an extra encoding pass in the browser's
// history layer), a single decode still leaves escaped sequences behind
// (%2F, %252F, ...). Keep decoding until the value stabilizes so any depth
// of encoding collapses back to the original name.
export function decodeRouteParam(value) {
  if (typeof value !== 'string') return value;
  let decoded = value;
  for (let i = 0; i < 5 && decoded.includes('%'); i++) {
    let next;
    try {
      next = decodeURIComponent(decoded);
    } catch {
      break;
    }
    if (next === decoded) break;
    decoded = next;
  }
  return decoded;
}
