import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { api } from 'api';
import HistoryLayers from 'components/Tag/Tabs/HistoryLayers';
import React from 'react';

const mockLayersList = [
  {
    Layer: { Size: '2806054', Digest: '213ec9aee27d8be045c6a92b7eac22c9a64b44558193775a1a7f626352392b49', Score: null },
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
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: { Image: { History: mockLayersList } } } });
    render(<HistoryLayers name="alpine:latest" />);
    expect(await screen.findAllByTestId('layer-card-container')).toHaveLength(1);
  });

  it('renders no layers if there are not any', async () => {
    jest.spyOn(api, 'get').mockResolvedValue({
      status: 200,
      data: { data: { History: { Tag: '', mockLayersList: [] } } }
    });
    render(<HistoryLayers name="alpine:latest" />);
    await waitFor(() => expect(screen.getAllByText(/No Layer data available/i)).toHaveLength(1));
  });

  it('opens dropdown and renders layer command and digest', async () => {
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: { Image: { History: mockLayersList } } } });
    render(<HistoryLayers name="alpine:latest" />);
    expect(screen.queryAllByText(/DIGEST/i)).toHaveLength(0);
    const openDetails = await screen.findAllByText(/details/i);
    fireEvent.click(openDetails[0]);
    expect(await screen.findAllByText(/DIGEST/i)).toHaveLength(1);
  });

  it("should log an error when data can't be fetched", async () => {
    jest.spyOn(api, 'get').mockRejectedValue({ status: 500, data: {} });
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<HistoryLayers name="alpine:latest" />);
    await waitFor(() => expect(error).toBeCalledTimes(1));
  });
});
