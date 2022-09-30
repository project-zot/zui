import { render, screen, waitFor } from '@testing-library/react';
import { api } from 'api';
import TagDetails from 'components/TagDetails';
import React from 'react';

const mockImage = {
  ExpandedRepoInfo: {
    Images: [
      {
        Digest: '7374731e3dd3112d41ece21cf2db5a16f11a51b33bf065e98c767893f50d3dec',
        Tag: 'latest',
        Layers: [
          {
            Size: '28572596',
            Digest: '3b65ec22a9e96affe680712973e88355927506aa3f792ff03330f3a3eb601a98'
          },
          {
            Size: '1835',
            Digest: '016bc871e2b33f0e2a37272769ebd6defdb4b702f0d41ec1e685f0366b64e64a'
          },
          {
            Size: '3059542',
            Digest: '9ddd649edd82d79ffc6f573cd5da7909ae50596b95aca684a571aff6e36aa8cb'
          },
          {
            Size: '6506025',
            Digest: '39bf776c01e412c9cf35ea7a41f97370c486dee27a2aab228cf2e850a8863e8b'
          },
          {
            Size: '149',
            Digest: 'f7f0405a2fe343547a60a9d4182261ca02d70bb9e47d6cd248f3285d6b41e64c'
          },
          {
            Size: '1447',
            Digest: '89785d0d9c65afe73fbd9bcb29c451090ca84df0e128cf1ecf5712c036e8c9d2'
          },
          {
            Size: '261',
            Digest: 'fd40d84c80b0302ca13faab8210d8c7082814f6f2ab576b3a61f467d03e1cb0b'
          },
          {
            Size: '193228772',
            Digest: 'd50d65ac4752500ab9f3c24c86b4aa218bea9a0bb0a837ae54ffe2e6d2454f5a'
          },
          {
            Size: '5067',
            Digest: '255e24cbd370c0055e0d31e063e63c792fa68aff9e25a7ac0a21d39cf6d47573'
          }
        ]
      }
    ],
    Summary: {
      Name: 'mongo',
      LastUpdated: '2022-08-02T01:30:49.193203152Z',
      Size: '231383863',
      Platforms: [
        {
          Os: 'linux',
          Arch: 'amd64'
        }
      ],
      Vendors: [''],
      NewestImage: null
    }
  }
};

jest.mock('react-router-dom', () => ({
  // @ts-ignore
  ...jest.requireActual('react-router-dom'),
  useParams: () => {
    return { name: 'test' };
  }
}));

afterEach(() => {
  // restore the spy created with spyOn
  jest.restoreAllMocks();
});

describe('Tags details', () => {
  it('should show vulnerability tab', async () => {
    // @ts-ignore
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockImage } });
    render(<TagDetails />);
    await waitFor(() => expect(screen.getAllByRole('tab')).toHaveLength(4));
  });

  it("should log an error when data can't be fetched", async () => {
    jest.spyOn(api, 'get').mockRejectedValue({ status: 500, data: {} });
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<TagDetails />);
    await waitFor(() => expect(error).toBeCalledTimes(2));
  });
  it('should show tag details metadata', async () => {
    // @ts-ignore
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockImage } });
    render(<TagDetails />);
    expect(await screen.findByTestId('tagDetailsMetadata-container')).toBeInTheDocument();
  });
});
