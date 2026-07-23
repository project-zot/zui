// React Router already decodes route params for us, including collapsing one
// extra layer of '%25' re-encoding and turning '%2F' into a literal slash
// (see matchRoutesImpl/matchPathImpl in the router package). This only mops
// up one further layer of that same re-encoding (e.g. a manually crafted or
// bookmarked link using lowercase escapes, which the router's own %2F match
// doesn't normalize the way it does for uppercase).
//
// It intentionally only ever touches the '%25' and '%2F' escape sequences,
// in a single pass, and never runs a generic decodeURIComponent: route
// params are interpolated unescaped into GraphQL query strings (see
// src/api.js), so decoding arbitrary percent-encoded characters (e.g.
// %22 -> ") would let a crafted URL break out of the quoted string.
export function decodeRouteParam(value) {
  if (typeof value !== 'string') return value;
  return value.replace(/%25/gi, '%').replace(/%2f/gi, '/');
}
