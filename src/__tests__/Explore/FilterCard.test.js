import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FilterCard from 'components/Shared/FilterCard';
import React, { useState } from 'react';
import filterConstants from 'utilities/filterConstants';
import MockThemeProvider from '__mocks__/MockThemeProvider';

const StateFilterCardWrapper = () => {
  const [filters, setFilters] = useState([]);
  return (
    <MockThemeProvider>
      <FilterCard
        title="Operating System"
        filters={filterConstants.osFilters}
        updateFilters={setFilters}
        filterValue={filters}
      />
    </MockThemeProvider>
  );
};

describe('Filters components', () => {
  it('renders the filters cards', async () => {
    render(<StateFilterCardWrapper />);
    expect(screen.getAllByRole('checkbox')).toHaveLength(3);

    const checkbox = screen.getAllByRole('checkbox');
    expect(checkbox[0]).not.toBeChecked();
    fireEvent.click(checkbox[0]);
    await waitFor(() => expect(checkbox[0]).toBeChecked());
  });
});
