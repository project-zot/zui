import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { api } from 'api';
import HistoryLayers from 'components/HistoryLayers';
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
    // @ts-ignore
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: { Image: { History: mockLayersList } } } });
    render(<HistoryLayers name="alpine:latest" />);
    expect(await screen.findAllByTestId('layer-card-container')).toHaveLength(2);
  });

  it('renders no layers if there are not any', async () => {
    // @ts-ignore
    jest.spyOn(api, 'get').mockResolvedValue({
      status: 200,
      data: { data: { History: { Tag: '', mockLayersList: [] } } }
    });
    render(<HistoryLayers name="alpine:latest" />);
    await waitFor(() => expect(screen.getAllByText('No Layers')).toHaveLength(1));
  });

  it('renders hash layers', async () => {
    // @ts-ignore
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: { Image: { History: mockLayersList } } } });
    render(<HistoryLayers name="alpine:latest" />);
    expect(await screen.findAllByTestId('hash-typography')).toHaveLength(1);
    const openText = screen.getByText(/2:/i);
    fireEvent.click(openText);
    expect(await screen.findAllByTestId('no-hash-typography')).toHaveLength(1);
  });

  it("should log an error when data can't be fetched", async () => {
    // @ts-ignore
    jest.spyOn(api, 'get').mockRejectedValue({ status: 500, data: {} });
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<HistoryLayers name="alpine:latest" />);
    await waitFor(() => expect(error).toBeCalledTimes(1));
  });
});
