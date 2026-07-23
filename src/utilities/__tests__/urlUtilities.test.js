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

    it('does not throw on malformed percent sequences and returns the best-effort decode', () => {
      expect(() => decodeRouteParam('myapp%')).not.toThrow();
      expect(decodeRouteParam('myapp%')).toBe('myapp%');
    });
  });
});
