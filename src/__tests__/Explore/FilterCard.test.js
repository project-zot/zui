import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FilterCard from 'components/FilterCard';
import React, { useState } from 'react';
import filterConstants from 'utilities/filterConstants';

const StateFilterCardWrapper = () => {
  const [filters, setFilters] = useState([]);
  return (
    <FilterCard title="Products" filters={filterConstants.osFilters} updateFilters={setFilters} filterValue={filters} />
  );
};

describe('Filters components', () => {
  it('renders the filters cards', async () => {
    render(<StateFilterCardWrapper />);
    expect(screen.getAllByRole('checkbox')).toHaveLength(2);

    const checkbox = screen.getAllByRole('checkbox');
    expect(checkbox[0]).not.toBeChecked();
    fireEvent.click(checkbox[0]);
    await waitFor(() => expect(checkbox[0]).toBeChecked());
  });
});
