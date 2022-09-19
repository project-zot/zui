import { render, screen , fireEvent } from '@testing-library/react';
import FilterCard from 'components/FilterCard';
import React, {useState} from 'react';

const StateFilterCardWrapper = () => {
    return (<FilterCard title="Products" filters={["Images","Plugins"]} />)
  }

describe('Filters components', () => {
  it('renders the filters cards', () => {
    render(<StateFilterCardWrapper/>  );
    expect(screen.getAllByRole('checkbox')).toHaveLength(2);

    const checkbox = screen.getAllByRole('checkbox');
    expect(checkbox[0]).not.toBeChecked()
    fireEvent.click(checkbox[0])
    expect(checkbox[0]).toBeChecked()
  });
});
