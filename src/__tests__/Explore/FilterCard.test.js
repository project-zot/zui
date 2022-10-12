import { render, screen, fireEvent } from '@testing-library/react';
import FilterCard from 'components/FilterCard';
import React from 'react';
import filterConstants from 'utilities/filterConstants';

const StateFilterCardWrapper = () => {
  return <FilterCard title="Products" filters={filterConstants.osFilters} updateFilters={() => {}} filterValue={[]} />;
};

describe('Filters components', () => {
  it('renders the filters cards', () => {
    render(<StateFilterCardWrapper />);
    expect(screen.getAllByRole('checkbox')).toHaveLength(2);

    const checkbox = screen.getAllByRole('checkbox');
    expect(checkbox[0]).not.toBeChecked();
    fireEvent.click(checkbox[0]);
    expect(checkbox[0]).toBeChecked();
  });
});
