import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FilterCard from 'components/Shared/FilterCard';
import React, { useState } from 'react';
import filterConstants from 'utilities/filterConstants';
import MockThemeProvier from '__mocks__/MockThemeProvider';

const StateFilterCardWrapper = () => {
  const [filters, setFilters] = useState([]);
  return (
    <MockThemeProvier>
      <FilterCard
        title="Operating System"
        filters={filterConstants.osFilters}
        updateFilters={setFilters}
        filterValue={filters}
      />
    </MockThemeProvier>
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
