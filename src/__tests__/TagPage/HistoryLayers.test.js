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
    await waitFor(() => expect(screen.getAllByText(/historyLayers.noLayers/i)).toHaveLength(1));
  });

  it('opens dropdown and renders layer command and digest', async () => {
    render(<HistoryLayers name="alpine:latest" history={mockLayersList} />);
    expect(screen.queryAllByText(/DIGEST/i)).toHaveLength(0);
    const openDetails = await screen.findAllByText(/details/i);
    fireEvent.click(openDetails[0]);
    expect(await screen.findAllByText(/DIGEST/i)).toHaveLength(1);
  });
});
