import { decodeRouteParam } from '../urlUtilities';

describe('urlUtilities', () => {
  describe('decodeRouteParam', () => {
    it('returns non-string values unchanged', () => {
      expect(decodeRouteParam(undefined)).toBeUndefined();
      expect(decodeRouteParam(null)).toBeNull();
    });

    it('returns a value with no percent-encoding unchanged', () => {
      expect(decodeRouteParam('myapp')).toBe('myapp');
    });

    it('decodes a single real slash already resolved by the router', () => {
      // React Router decodes location segments once before exposing them via useParams,
      // so a repo name containing a real '/' arrives here already decoded.
      expect(decodeRouteParam('company/users/foobar/myapp')).toBe('company/users/foobar/myapp');
    });

    it('decodes a name that survived one extra encoding pass (%2F)', () => {
      expect(decodeRouteParam('company%2Fusers%2Ffoobar%2Fmyapp')).toBe('company/users/foobar/myapp');
    });

    it('decodes a name that survived two extra encoding passes (%252F)', () => {
      expect(decodeRouteParam('company%252Fusers%252Ffoobar%252Fmyapp')).toBe('company/users/foobar/myapp');
    });

    it('only resolves up to one extra %25 layer beyond what the router already handles, not arbitrary depth', () => {
      // React Router's own param matching already collapses a %2F/%252F name down to a
      // real slash on its own, so this single pass only needs to catch one further layer
      // (e.g. a lowercase escape the router's case-sensitive match misses). A third layer
      // is not something any current code path in this app produces.
      expect(decodeRouteParam('company%25252Fusers%25252Ffoobar%25252Fmyapp')).toBe(
        'company%252Fusers%252Ffoobar%252Fmyapp'
      );
    });

    it('decodes lowercase percent-escapes the same as uppercase (percent-encoding is case-insensitive)', () => {
      expect(decodeRouteParam('company%2fusers%2ffoobar%2fmyapp')).toBe('company/users/foobar/myapp');
      expect(decodeRouteParam('company%252fusers%252ffoobar%252fmyapp')).toBe('company/users/foobar/myapp');
    });

    it('does not throw on malformed percent sequences and returns the best-effort decode', () => {
      expect(() => decodeRouteParam('myapp%')).not.toThrow();
      expect(decodeRouteParam('myapp%')).toBe('myapp%');
    });

    it('never decodes escape sequences other than %25 and %2F, since params are interpolated unescaped into GraphQL query strings', () => {
      // %22 is a single-encoded double quote; a generic decode would turn it into a
      // literal '"' and let the value break out of the quoted GraphQL string in api.js.
      expect(decodeRouteParam('my%22app')).toBe('my%22app');
      // %2522 is a double-encoded double quote: only the extra '%25' layer should
      // collapse (to the harmless literal text '%22'), never all the way to '"'.
      expect(decodeRouteParam('my%2522app')).toBe('my%22app');
      expect(decodeRouteParam('my%2522app')).not.toContain('"');
    });
  });
});
