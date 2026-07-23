// React Router already decodes route params for us, including collapsing one
// extra layer of '%25' re-encoding and turning '%2F' into a literal slash
// (see matchRoutesImpl/matchPathImpl in the router package). This only mops
// up one further layer of that same re-encoding (e.g. a manually crafted or
// bookmarked link using lowercase escapes, which the router's own %2F match
// doesn't normalize the way it does for uppercase).
//
// Route params are interpolated unencoded into GraphQL query URLs (see
// src/api.js, e.g. `?query={...repo:"${name}"...}`), which the server
// unescapes once when parsing the `query` param. So a blanket '%25' -> '%'
// replace is not safe on its own: collapsing '%2522' (a double-encoded '"')
// to '%22' would still decode to a literal '"' server-side and break out of
// the quoted string, even though this function never produces that '"'
// itself. Only collapse a '%25' when it is actually part of a slash-escape
// chain (optionally repeated '25's ending in '2f'/'2F') -- every other
// escape sequence, including %22, is left completely untouched.
export function decodeRouteParam(value) {
  if (typeof value !== 'string') return value;
  return value.replace(/%25(?=(?:25)*2f)/gi, '%').replace(/%2f/gi, '/');
}
