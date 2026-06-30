import { mapToImage, mapToManifest } from '../objectModels';

describe('objectModels', () => {
  describe('mapToImage', () => {
    it('should map TaggedTimestamp to lastTagged', () => {
      const responseImage = {
        RepoName: 'test-repo',
        Tag: 'latest',
        TaggedTimestamp: '2020-12-10T00:22:52.526672082Z',
        LastUpdated: '2020-12-08T00:22:52.526672082Z',
        Manifests: [],
        Referrers: [],
        Size: '1000',
        DownloadCount: 10,
        StarCount: 5,
        Description: 'Test description',
        IsSigned: false,
        SignatureInfo: [],
        Licenses: 'MIT',
        Labels: [],
        Title: 'Test Title',
        Source: 'https://example.com',
        Documentation: 'Test docs',
        Vendor: 'Test Vendor',
        Authors: [],
        Vulnerabilities: { MaxSeverity: 'NONE', Count: 0 },
        IsDeletable: true
      };

      const result = mapToImage(responseImage);

      expect(result.lastTagged).toBe('2020-12-10T00:22:52.526672082Z');
      expect(result.repoName).toBe('test-repo');
      expect(result.tag).toBe('latest');
      expect(result.lastUpdated).toBe('2020-12-08T00:22:52.526672082Z');
    });

    it('should handle missing TaggedTimestamp', () => {
      const responseImage = {
        RepoName: 'test-repo',
        Tag: 'latest',
        LastUpdated: '2020-12-08T00:22:52.526672082Z',
        Manifests: [],
        Referrers: [],
        Size: '1000',
        DownloadCount: 10,
        StarCount: 5,
        Description: 'Test description',
        IsSigned: false,
        SignatureInfo: [],
        Licenses: 'MIT',
        Labels: [],
        Title: 'Test Title',
        Source: 'https://example.com',
        Documentation: 'Test docs',
        Vendor: 'Test Vendor',
        Authors: [],
        Vulnerabilities: { MaxSeverity: 'NONE', Count: 0 },
        IsDeletable: true
      };

      const result = mapToImage(responseImage);

      expect(result.lastTagged).toBeUndefined();
      expect(result.repoName).toBe('test-repo');
    });
  });

  describe('mapToManifest', () => {
    it('should map manifest data correctly', () => {
      const responseManifest = {
        Digest: 'sha256:abc123',
        ConfigDigest: 'sha256:def456',
        LastUpdated: '2020-12-08T00:22:52.526672082Z',
        Size: '75183423',
        Platform: {
          Os: 'linux',
          Arch: 'amd64'
        },
        DownloadCount: 10,
        StarCount: 5,
        Layers: [],
        History: [],
        Vulnerabilities: { MaxSeverity: 'NONE', Count: 0 },
        Referrers: []
      };

      const result = mapToManifest(responseManifest);

      expect(result.digest).toBe('sha256:abc123');
      expect(result.configDigest).toBe('sha256:def456');
      expect(result.lastUpdated).toBe('2020-12-08T00:22:52.526672082Z');
      expect(result.size).toBe('75183423');
      expect(result.platform).toEqual({ Os: 'linux', Arch: 'amd64' });
      // Verify lastTagged is not included in manifest mapping
      expect(result.lastTagged).toBeUndefined();
    });
  });
});

