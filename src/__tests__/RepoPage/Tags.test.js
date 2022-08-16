import { fireEvent, render, screen } from '@testing-library/react';
import Tags from 'components/Tags';
import React from 'react';

const mockedTagsData = {
  name: 'test',
  tags: [
    {
      "Digest": "2aa7ff5ca352d4d25fc6548f9930a436aacd64d56b1bd1f9ff4423711b9c8718",
      "Tag": "latest",
      "Layers": [
        {
          "Size": "2798889",
          "Digest": "2408cc74d12b6cd092bb8b516ba7d5e290f485d3eb9672efc00f0583730179e8"
        }
      ]
    }
  ]
};

describe('Tags component', () => {
  it('should open and close details dropdown for tags', () => {
    render(<Tags data={mockedTagsData}/>);
    const openBtn = screen.getByText(/see layers/i);
    fireEvent.click(openBtn);
    expect(screen.queryByText(/see layers/i)).not.toBeInTheDocument();
    expect(screen.getByText(/hide layers/i)).toBeInTheDocument();
  });
})