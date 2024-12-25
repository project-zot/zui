import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReferredBy from 'components/Tag/Tabs/ReferredBy';
import React from 'react';

const mockReferrersList = [
  {
    MediaType: 'application/vnd.oci.artifact.manifest.v1+json',
    ArtifactType: 'application/vnd.example.icecream.v1',
    Size: 466,
    Digest: 'sha256:be7a3d01c35a2cf53c502e9dc50cdf36b15d9361c81c63bf319f1d5cbe44ab7c',
    Annotations: [
      {
        Key: 'demo',
        Value: 'true'
      },
      {
        Key: 'format',
        Value: 'oci'
      }
    ]
  },
  {
    MediaType: 'application/vnd.oci.artifact.manifest.v1+json',
    ArtifactType: 'application/vnd.example.icecream.v1',
    Size: 466,
    Digest: 'sha256:d9ad22f41d9cb9797c134401416eee2a70446cee1a8eb76fc6b191f4320dade2',
    Annotations: [
      {
        Key: 'demo',
        Value: 'true'
      },
      {
        Key: 'format',
        Value: 'oci'
      }
    ]
  }
];

// useNavigate mock
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate
}));

afterEach(() => {
  // restore the spy created with spyOn
  jest.restoreAllMocks();
});

describe('Referred by tab', () => {
  it('should render referrers if there are any', async () => {
    render(<ReferredBy referrers={mockReferrersList} />);
    expect(await screen.findAllByText('referrerCard.mediaType application/vnd.oci.artifact.manifest.v1+json')).toHaveLength(2);
  });

  it("renders no referrers if there aren't any", async () => {
    render(<ReferredBy referrers={[]} />);
    expect(await screen.findByText(/main.nothingFound/i)).toBeInTheDocument();
  });

  it('should display the digest when clicking the dropdowns', async () => {
    render(<ReferredBy referrers={mockReferrersList} />);
    const firstDigest = (await screen.findAllByText(/digest/i))[0];
    expect(firstDigest).toBeInTheDocument();
    await userEvent.click(firstDigest);
    expect(
      await screen.findByText(/sha256:be7a3d01c35a2cf53c502e9dc50cdf36b15d9361c81c63bf319f1d5cbe44ab7c/i)
    ).toBeInTheDocument();
    await userEvent.click(firstDigest);
    expect(
      await screen.findByText(/sha256:be7a3d01c35a2cf53c502e9dc50cdf36b15d9361c81c63bf319f1d5cbe44ab7c/i)
    ).not.toBeInTheDocument();
  });

  it('should display the annotations when clicking the dropdown', async () => {
    render(<ReferredBy referrers={mockReferrersList} />);
    const firstAnnotations = (await screen.findAllByText(/ANNOTATIONS/i))[0];
    expect(firstAnnotations).toBeInTheDocument();
    await userEvent.click(firstAnnotations);
    expect(await screen.findByText(/demo: true/i)).toBeInTheDocument();
    await userEvent.click(firstAnnotations);
  });
});
