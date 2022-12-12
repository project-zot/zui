import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { api } from 'api';
import TagDetails from 'components/TagDetails';
import React from 'react';

const mockImage = {
  Image: {
    RepoName: 'centos',
    Tag: '8',
    Digest: 'sha256:63a795ca90aa6e7cca60941e826810a4cd0a2e73ea02bf458241df2a5c973e29',
    LastUpdated: '2020-12-08T00:22:52.526672082Z',
    Size: '75183423',
    ConfigDigest: 'sha256:8dd57e171a61368ffcfde38045ddb6ed74a32950c271c1da93eaddfb66a77e78',
    Platform: {
      Os: 'linux',
      Arch: 'amd64'
    },
    Vulnerabilities: {
      MaxSeverity: 'CRITICAL',
      Count: 10
    },
    Vendor: 'CentOS',
    History: [
      {
        Layer: {
          Size: '75181999',
          Digest: 'sha256:7a0437f04f83f084b7ed68ad9c4a4947e12fc4e1b006b38129bac89114ec3621',
          Score: null
        },
        HistoryDescription: {
          Created: '2020-12-08T00:22:52.526672082Z',
          CreatedBy:
            '/bin/sh -c #(nop) ADD file:bd7a2aed6ede423b719ceb2f723e4ecdfa662b28639c8429731c878e86fb138b in / ',
          Author: '',
          Comment: '',
          EmptyLayer: false
        }
      },
      {
        Layer: null,
        HistoryDescription: {
          Created: '2020-12-08T00:22:52.895811646Z',
          CreatedBy:
            '/bin/sh -c #(nop)  LABEL org.label-schema.schema-version=1.0 org.label-schema.name=CentOS Base Image org.label-schema.vendor=CentOS org.label-schema.license=GPLv2 org.label-schema.build-date=20201204',
          Author: '',
          Comment: '',
          EmptyLayer: true
        }
      },
      {
        Layer: null,
        HistoryDescription: {
          Created: '2020-12-08T00:22:53.076477777Z',
          CreatedBy: '/bin/sh -c #(nop)  CMD ["/bin/bash"]',
          Author: '',
          Comment: '',
          EmptyLayer: true
        }
      }
    ]
  }
};

const mockImageNone = {
  Image: {
    RepoName: 'centos',
    Tag: '8',
    Digest: 'sha256:63a795ca90aa6e7cca60941e826810a4cd0a2e73ea02bf458241df2a5c973e29',
    LastUpdated: '2020-12-08T00:22:52.526672082Z',
    Size: '75183423',
    ConfigDigest: 'sha256:8dd57e171a61368ffcfde38045ddb6ed74a32950c271c1da93eaddfb66a77e78',
    Platform: {
      Os: 'linux',
      Arch: 'amd64'
    },
    Vulnerabilities: {
      MaxSeverity: 'NONE',
      Count: 10
    },
    Vendor: 'CentOS'
  }
};

const mockImageUnknown = {
  Image: {
    RepoName: 'centos',
    Tag: '8',
    Digest: 'sha256:63a795ca90aa6e7cca60941e826810a4cd0a2e73ea02bf458241df2a5c973e29',
    LastUpdated: '2020-12-08T00:22:52.526672082Z',
    Size: '75183423',
    ConfigDigest: 'sha256:8dd57e171a61368ffcfde38045ddb6ed74a32950c271c1da93eaddfb66a77e78',
    Platform: {
      Os: 'linux',
      Arch: 'amd64'
    },
    Vulnerabilities: {
      MaxSeverity: 'UNKNOWN',
      Count: 10
    },
    Vendor: 'CentOS'
  }
};

const mockImageFailed = {
  Image: {
    RepoName: 'centos',
    Tag: '8',
    Digest: 'sha256:63a795ca90aa6e7cca60941e826810a4cd0a2e73ea02bf458241df2a5c973e29',
    LastUpdated: '2020-12-08T00:22:52.526672082Z',
    Size: '75183423',
    ConfigDigest: 'sha256:8dd57e171a61368ffcfde38045ddb6ed74a32950c271c1da93eaddfb66a77e78',
    Platform: {
      Os: 'linux',
      Arch: 'amd64'
    },
    Vulnerabilities: {
      MaxSeverity: '',
      Count: 10
    },
    Vendor: 'CentOS'
  }
};

const mockImageLow = {
  Image: {
    RepoName: 'centos',
    Tag: '8',
    Digest: 'sha256:63a795ca90aa6e7cca60941e826810a4cd0a2e73ea02bf458241df2a5c973e29',
    LastUpdated: '2020-12-08T00:22:52.526672082Z',
    Size: '75183423',
    ConfigDigest: 'sha256:8dd57e171a61368ffcfde38045ddb6ed74a32950c271c1da93eaddfb66a77e78',
    Platform: {
      Os: 'linux',
      Arch: 'amd64'
    },
    Vulnerabilities: {
      MaxSeverity: 'LOW',
      Count: 10
    },
    Vendor: 'CentOS'
  }
};

const mockImageMedium = {
  Image: {
    RepoName: 'centos',
    Tag: '8',
    Digest: 'sha256:63a795ca90aa6e7cca60941e826810a4cd0a2e73ea02bf458241df2a5c973e29',
    LastUpdated: '2020-12-08T00:22:52.526672082Z',
    Size: '75183423',
    ConfigDigest: 'sha256:8dd57e171a61368ffcfde38045ddb6ed74a32950c271c1da93eaddfb66a77e78',
    Platform: {
      Os: 'linux',
      Arch: 'amd64'
    },
    Vulnerabilities: {
      MaxSeverity: 'MEDIUM',
      Count: 10
    },
    Vendor: 'CentOS'
  }
};

const mockImageHigh = {
  Image: {
    RepoName: 'centos',
    Tag: '8',
    Digest: 'sha256:63a795ca90aa6e7cca60941e826810a4cd0a2e73ea02bf458241df2a5c973e29',
    LastUpdated: '2020-12-08T00:22:52.526672082Z',
    Size: '75183423',
    ConfigDigest: 'sha256:8dd57e171a61368ffcfde38045ddb6ed74a32950c271c1da93eaddfb66a77e78',
    Platform: {
      Os: 'linux',
      Arch: 'amd64'
    },
    Vulnerabilities: {
      MaxSeverity: 'HIGH',
      Count: 10
    },
    Vendor: 'CentOS'
  }
};

// mock clipboard copy fn
const mockCopyToClipboard = jest.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: mockCopyToClipboard
  }
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => {
    return { name: 'test', tag: '1.0.1' };
  }
}));

jest.mock('../../host', () => ({
  host: () => 'http://localhost',
  hostRoot: () => 'localhost'
}));

beforeEach(() => {
  // IntersectionObserver isn't available in test environment
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null
  });
  window.IntersectionObserver = mockIntersectionObserver;
  window.scrollTo = jest.fn();
});

afterEach(() => {
  // restore the spy created with spyOn
  jest.restoreAllMocks();
});

describe('Tags details', () => {
  it('should show tabs and allow nagivation between them', async () => {
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockImage } });
    render(<TagDetails />);
    const dependenciesTab = await screen.findByTestId('dependencies-tab');
    fireEvent.click(dependenciesTab);
    expect(await screen.findByTestId('depends-on-container')).toBeInTheDocument();
    await waitFor(() => expect(screen.getAllByRole('tab')).toHaveLength(4));
  });

  it("should log an error when data can't be fetched", async () => {
    jest.spyOn(api, 'get').mockRejectedValue({ status: 500, data: {} });
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<TagDetails />);
    await waitFor(() => expect(error).toBeCalledTimes(1));
  });

  it('should show tag details metadata', async () => {
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockImage } });
    render(<TagDetails />);
    expect(await screen.findByTestId('tagDetailsMetadata-container')).toBeInTheDocument();
  });

  it('renders vulnerability icons', async () => {
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockImage } });
    render(<TagDetails />);
    expect(await screen.findByTestId('critical-vulnerability-icon')).toBeInTheDocument();

    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockImageNone } });
    render(<TagDetails />);
    expect(await screen.findByTestId('none-vulnerability-icon')).toBeInTheDocument();

    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockImageUnknown } });
    render(<TagDetails />);
    expect(await screen.findByTestId('unknown-vulnerability-icon')).toBeInTheDocument();

    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockImageFailed } });
    render(<TagDetails />);
    expect(await screen.findByTestId('failed-vulnerability-icon')).toBeInTheDocument();

    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockImageLow } });
    render(<TagDetails />);
    expect(await screen.findByTestId('low-vulnerability-icon')).toBeInTheDocument();

    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockImageMedium } });
    render(<TagDetails />);
    expect(await screen.findByTestId('medium-vulnerability-icon')).toBeInTheDocument();

    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockImageHigh } });
    render(<TagDetails />);
    expect(await screen.findByTestId('high-vulnerability-icon')).toBeInTheDocument();
  });

  it('should copy the docker pull string to clipboard', async () => {
    jest
      .spyOn(api, 'get')

      .mockResolvedValue({ status: 200, data: { data: mockImage } });
    render(<TagDetails />);
    const dropdown = await screen.findByText('Pull Image');
    expect(dropdown).toBeInTheDocument();
    userEvent.click(dropdown);
    await waitFor(() => expect(screen.queryAllByTestId('pull-meniuItem')).toHaveLength(1));
    fireEvent.click(await screen.findByTestId('pullcopy-btn'));
    await waitFor(() => expect(mockCopyToClipboard).toHaveBeenCalledWith('docker pull localhost/centos:8'));
  });

  it('should copy the podman pull string to clipboard', async () => {
    jest
      .spyOn(api, 'get')

      .mockResolvedValue({ status: 200, data: { data: mockImage } });
    render(<TagDetails />);
    const dropdown = await screen.findByText('Pull Image');
    expect(dropdown).toBeInTheDocument();
    userEvent.click(dropdown);
    await waitFor(() => expect(screen.queryAllByTestId('pull-meniuItem')).toHaveLength(1));
    const podmanTab = await screen.findByText('Podman');
    userEvent.click(podmanTab);
    fireEvent.click(await screen.findByTestId('podmanPullcopy-btn'));
    await waitFor(() => expect(mockCopyToClipboard).toHaveBeenCalledWith('podman pull localhost/centos:8'));
  });

  it('should copy the skopeo copy string to clipboard', async () => {
    jest
      .spyOn(api, 'get')

      .mockResolvedValue({ status: 200, data: { data: mockImage } });
    render(<TagDetails />);
    const dropdown = await screen.findByText('Pull Image');
    expect(dropdown).toBeInTheDocument();
    userEvent.click(dropdown);
    await waitFor(() => expect(screen.queryAllByTestId('pull-meniuItem')).toHaveLength(1));
    const skopeoTab = await screen.findByText('Skopeo');
    userEvent.click(skopeoTab);
    fireEvent.click(await screen.findByTestId('skopeoPullcopy-btn'));
    await waitFor(() => expect(mockCopyToClipboard).toHaveBeenCalledWith('skopeo copy docker://localhost/centos:8'));
  });

  it('should show pull tabs in dropdown and allow nagivation between them', async () => {
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockImage } });
    render(<TagDetails />);
    const dropdown = await screen.findByText('Pull Image');
    expect(dropdown).toBeInTheDocument();
    userEvent.click(dropdown);
    await waitFor(() => expect(screen.queryAllByTestId('pull-meniuItem')).toHaveLength(1));
    const podmanTab = await screen.findByText('Podman');
    userEvent.click(podmanTab);
    await waitFor(() => expect(screen.queryAllByTestId('podman-input')).toHaveLength(1));
    await waitFor(() => expect(screen.getAllByRole('tab')).toHaveLength(3));
  });

  it('should show the copied successfully button for 3 seconds', async () => {
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockImage } });
    render(<TagDetails />);
    const dropdown = await screen.findByText('Pull Image');
    expect(dropdown).toBeInTheDocument();
    userEvent.click(dropdown);
    await waitFor(() => expect(screen.queryAllByTestId('pull-dropdown')).toHaveLength(1));
    await waitFor(() => expect(screen.queryAllByTestId('successPulled-buton')).toHaveLength(0));
    fireEvent.click(await screen.findByTestId('pullcopy-btn'));
    await waitFor(() => expect(screen.queryAllByTestId('successPulled-buton')).toHaveLength(1));
    await waitFor(() => expect(screen.queryAllByTestId('pull-dropdown')).toHaveLength(0));

    await waitFor(() => expect(screen.queryAllByTestId('pull-dropdown')).toHaveLength(1), { timeout: 3500 });
    await waitFor(() => expect(screen.queryAllByTestId('successPulled-buton')).toHaveLength(0));
  });
});
