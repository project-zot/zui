import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import PullCommandButton from 'components/Shared/PullCommandButton';
import MockThemeProvider from '__mocks__/MockThemeProvider';

jest.mock('../../host', () => ({
  hostRoot: () => 'localhost'
}));

const mockCopyToClipboard = jest.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: mockCopyToClipboard
  }
});

const PullCommandButtonWrapper = ({ imageName, isArtifact }) => (
  <MockThemeProvider>
    <PullCommandButton imageName={imageName} isArtifact={isArtifact} />
  </MockThemeProvider>
);

afterEach(() => {
  jest.restoreAllMocks();
  jest.clearAllMocks();
});

describe('PullCommandButton', () => {
  it('closes menu without copying when Escape is pressed', async () => {
    const imageName = 'hello-world:latest';
    render(<PullCommandButtonWrapper imageName={imageName} isArtifact={false} />);

    await userEvent.click(await screen.findByText(`Pull ${imageName}`));
    await screen.findByTestId('pull-dropdown');

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByTestId('pull-dropdown')).not.toBeInTheDocument());
    expect(screen.queryByTestId('successPulled-buton')).not.toBeInTheDocument();
  });

  it('resets selected pull command when artifact mode changes', async () => {
    const imageName = 'hello-artifact:v1';

    const { rerender } = render(<PullCommandButtonWrapper imageName={imageName} isArtifact />);

    await userEvent.click(await screen.findByText(`Pull ${imageName}`));
    await waitFor(() => expect(screen.queryAllByTestId('pull-menuItem')).toHaveLength(1));

    await userEvent.click(await screen.findByTestId('orasPullcopy-btn'));
    expect(mockCopyToClipboard).toHaveBeenCalledWith(`oras pull localhost/${imageName}`);

    await waitFor(() => expect(screen.queryAllByTestId('successPulled-buton')).toHaveLength(0), { timeout: 3000 });

    rerender(<PullCommandButtonWrapper imageName={imageName} isArtifact={false} />);

    await userEvent.click(await screen.findByText(`Pull ${imageName}`));
    await waitFor(() => expect(screen.queryAllByText('ORAS')).toHaveLength(0));

    await userEvent.click(await screen.findByTestId('pullcopy-btn'));
    expect(mockCopyToClipboard).toHaveBeenLastCalledWith(`docker pull localhost/${imageName}`);
  });
});
