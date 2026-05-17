import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import HistoryLayers from 'components/Tag/Tabs/HistoryLayers';
import React from 'react';

const mockLayersList = [
  {
    Layer: { Size: '2806054', Digest: '213ec9aee27d8be045c6a92b7eac22c9a64b44558193775a1a7f626352392b49' },
    HistoryDescription: {
      Created: '2022-08-09T17:19:53.274069586Z',
      CreatedBy: '/bin/sh -c #(nop) ADD file:2a949686d9886ac7c10582a6c29116fd29d3077d02755e87e111870d63607725 in / ',
      Author: '',
      Comment: '',
      EmptyLayer: false
    }
  },
  {
    Layer: null,
    HistoryDescription: {
      Created: '2022-08-09T17:19:53.47374331Z',
      CreatedBy: '/bin/sh -c #(nop)  CMD ["/bin/sh"]',
      Author: '',
      Comment: '',
      EmptyLayer: true
    }
  }
];

const mockArtifactLayers = [
  {
    mediaType: 'text/plain',
    size: 12,
    digest: 'sha256:a948904f2f0f479b8f8197694b30184b0d2ed1c1cd2a1ec0fb85d299a192a447',
    annotations: [{ key: 'org.opencontainers.image.title', value: 'artifact.txt' }]
  },
  {
    mediaType: 'application/octet-stream',
    size: 1024,
    digest: 'sha256:b948904f2f0f479b8f8197694b30184b0d2ed1c1cd2a1ec0fb85d299a192a448',
    annotations: []
  }
];

afterEach(() => {
  // restore the spy created with spyOn
  jest.restoreAllMocks();
});

describe('Layers page', () => {
  it('renders the layers if there are any', async () => {
    render(<HistoryLayers name="alpine:latest" history={mockLayersList} />);
    expect(await screen.findAllByTestId('layer-card-container')).toHaveLength(1);
  });

  it('renders no layers if there are not any', async () => {
    render(<HistoryLayers name="alpine:latest" history={[]} />);
    await waitFor(() => expect(screen.getAllByText(/No Layer data available/i)).toHaveLength(1));
  });

  it('opens dropdown and renders layer command and digest', async () => {
    render(<HistoryLayers name="alpine:latest" history={mockLayersList} />);
    expect(screen.queryAllByText(/DIGEST/i)).toHaveLength(0);
    const openDetails = await screen.findAllByText(/details/i);
    fireEvent.click(openDetails[0]);
    expect(await screen.findAllByText(/DIGEST/i)).toHaveLength(1);
  });
});

describe('Artifact files display', () => {
  it('renders "Artifact Files" title for artifact manifests', async () => {
    render(
      <HistoryLayers
        name="hello-artifact:v1"
        history={[]}
        artifactType="application/vnd.acme.rocket.config"
        layers={mockArtifactLayers}
      />
    );
    expect(await screen.findByText('Artifact Files')).toBeInTheDocument();
  });

  it('renders artifact file cards for artifact manifests', async () => {
    render(
      <HistoryLayers
        name="hello-artifact:v1"
        history={[]}
        artifactType="application/vnd.acme.rocket.config"
        layers={mockArtifactLayers}
      />
    );
    expect(await screen.findAllByTestId('artifact-file-card')).toHaveLength(2);
  });

  it('shows artifact file title from org.opencontainers.image.title annotation', async () => {
    render(
      <HistoryLayers
        name="hello-artifact:v1"
        history={[]}
        artifactType="application/vnd.acme.rocket.config"
        layers={mockArtifactLayers}
      />
    );
    expect(await screen.findByText('artifact.txt')).toBeInTheDocument();
  });

  it('shows media type for each artifact file', async () => {
    render(
      <HistoryLayers
        name="hello-artifact:v1"
        history={[]}
        artifactType="application/vnd.acme.rocket.config"
        layers={mockArtifactLayers}
      />
    );
    expect(await screen.findByText('text/plain')).toBeInTheDocument();
  });

  it('toggles artifact file details with accessible button semantics', async () => {
    render(
      <HistoryLayers
        name="hello-artifact:v1"
        history={[]}
        artifactType="application/vnd.acme.rocket.config"
        layers={mockArtifactLayers}
      />
    );

    const detailsButtons = await screen.findAllByRole('button', { name: /details/i });
    expect(detailsButtons[0]).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(detailsButtons[0]);
    expect(detailsButtons[0]).toHaveAttribute('aria-expanded', 'true');
    expect(await screen.findByText('DIGEST')).toBeInTheDocument();
  });

  it('shows "No artifact files available" when artifact has no layers', async () => {
    render(
      <HistoryLayers
        name="hello-artifact:v1"
        history={[]}
        artifactType="application/vnd.acme.rocket.config"
        layers={[]}
      />
    );
    expect(await screen.findByText(/No artifact files available/i)).toBeInTheDocument();
  });

  it('renders "Layers" title for regular (non-artifact) manifests', async () => {
    render(<HistoryLayers name="alpine:latest" history={mockLayersList} />);
    expect(await screen.findByText('Layers')).toBeInTheDocument();
  });
});
