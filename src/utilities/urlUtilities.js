// React Router already decodes route params for us, including collapsing one
// extra layer of '%25' re-encoding and turning '%2F' into a literal slash
// (see matchRoutesImpl/matchPathImpl in the router package). This only mops
// up additional layers of that same re-encoding (e.g. a bookmarked link from
// before this bug was fixed, or a future relative navigation elsewhere in
// the app reintroducing it).
//
// It intentionally only ever touches the '%25' and '%2F' escape sequences
// and never runs a generic decodeURIComponent: route params are interpolated
// unescaped into GraphQL query strings (see src/api.js), so decoding
// arbitrary percent-encoded characters (e.g. %22 -> ") would let a crafted
// URL break out of the quoted string.
export function decodeRouteParam(value) {
  if (typeof value !== 'string') return value;
  let decoded = value;
  for (let i = 0; i < 5 && (/%25/i.test(decoded) || /%2f/i.test(decoded)); i++) {
    const next = decoded.replace(/%25/gi, '%').replace(/%2f/gi, '/');
    if (next === decoded) break;
    decoded = next;
  }
  return decoded;
}
