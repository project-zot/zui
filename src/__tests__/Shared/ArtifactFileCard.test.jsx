import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ArtifactFileCard from 'components/Shared/ArtifactFileCard';
import MockThemeProvider from '__mocks__/MockThemeProvider';

const ArtifactFileCardWrapper = ({ layer }) => (
  <MockThemeProvider>
    <ArtifactFileCard layer={layer} />
  </MockThemeProvider>
);

describe('ArtifactFileCard', () => {
  it('renders with title from annotation', async () => {
    const layer = {
      digest: 'sha256:abc123',
      mediaType: 'application/octet-stream',
      size: 1024,
      annotations: [{ key: 'org.opencontainers.image.title', value: 'myfile.txt' }]
    };
    render(<ArtifactFileCardWrapper layer={layer} />);
    expect(await screen.findByText('myfile.txt')).toBeInTheDocument();
    expect(screen.getByText('application/octet-stream')).toBeInTheDocument();
  });

  it('falls back to digest when no title annotation', async () => {
    const layer = {
      digest: 'sha256:abc123',
      size: 512,
      annotations: []
    };
    render(<ArtifactFileCardWrapper layer={layer} />);
    expect(await screen.findByText('sha256:abc123')).toBeInTheDocument();
  });

  it('renders without mediaType when not provided', async () => {
    const layer = {
      digest: 'sha256:def456',
      size: 256,
      annotations: [{ key: 'org.opencontainers.image.title', value: 'noMediaType.tar' }]
    };
    render(<ArtifactFileCardWrapper layer={layer} />);
    expect(await screen.findByText('noMediaType.tar')).toBeInTheDocument();
  });

  it('toggles details open and closed', async () => {
    const layer = {
      digest: 'sha256:abc123',
      mediaType: 'application/octet-stream',
      size: 1024,
      annotations: [{ key: 'org.opencontainers.image.title', value: 'myfile.txt' }]
    };
    render(<ArtifactFileCardWrapper layer={layer} />);

    const detailsButton = await screen.findByText('DETAILS');
    expect(screen.queryByText('DIGEST')).not.toBeInTheDocument();

    await userEvent.click(detailsButton);
    expect(await screen.findByText('DIGEST')).toBeInTheDocument();

    await userEvent.click(detailsButton);
    expect(screen.queryByText('DIGEST')).not.toBeInTheDocument();
  });

  it('renders with no layer prop', async () => {
    render(<ArtifactFileCardWrapper layer={undefined} />);
    expect(await screen.findByTestId('artifact-file-card')).toBeInTheDocument();
  });
});
