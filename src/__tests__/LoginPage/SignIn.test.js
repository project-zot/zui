import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import SignIn from 'components/Login/SignIn';
import { api } from '../../api';
import userEvent from '@testing-library/user-event';

const mockMgmtResponse = {
  distSpecVersion: '1.1.0-dev',
  binaryType: '-apikey-lint-metrics-mgmt-scrub-search-sync-ui-userprefs',
  http: { auth: { htpasswd: {}, openid: { providers: { github: {} } } } }
};

// useNavigate mock
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate
}));

afterEach(() => {
  // restore the spy created with spyOn
  jest.restoreAllMocks();
});

describe('Signin component automatic navigation', () => {
  it('navigates to homepage when user is already logged in', async () => {
    render(<SignIn isLoggedIn={true} setIsLoggedIn={() => {}} />);
    await expect(mockedUsedNavigate).toHaveBeenCalledWith('/home');
  });

  it('navigates to homepage when auth is disabled', async () => {
    // mock request to check auth
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { http: {} } });
    render(<SignIn isLoggedIn={false} setIsLoggedIn={() => {}} />);
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/home');
    });
  });
});

describe('Sign in form', () => {
  beforeEach(() => {
    // mock auth check request
    jest.spyOn(api, 'get').mockResolvedValue({
      status: 401,
      data: mockMgmtResponse
    });
  });

  it('should change username and password values on user input', async () => {
    render(<SignIn isLoggedIn={false} setIsLoggedIn={() => {}} />);
    const usernameInput = await screen.findByLabelText(/^signIn.username/i);
    const passwordInput = await screen.findByLabelText(/^signIn.enterPassword/i);
    fireEvent.change(usernameInput, { target: { value: 'test' } });
    fireEvent.change(passwordInput, { target: { value: 'test' } });
    expect(usernameInput).toHaveValue('test');
    expect(passwordInput).toHaveValue('test');
    expect(screen.getByTestId('openid-divider')).toBeInTheDocument();
  });

  it('should display error if username and password values are empty after change', async () => {
    render(<SignIn isLoggedIn={false} setIsLoggedIn={() => {}} />);
    const usernameInput = await screen.findByLabelText(/^signIn.username/i);
    const passwordInput = await screen.findByLabelText(/^signIn.enterPassword/i);
    userEvent.click(usernameInput);
    userEvent.type(usernameInput, 't');
    userEvent.type(usernameInput, '{backspace}');
    userEvent.click(passwordInput);
    userEvent.type(passwordInput, 't');
    userEvent.type(passwordInput, '{backspace}');
    const usernameError = await screen.findByText(/enter a username/i);
    const passwordError = await screen.findByText(/enter a password/i);
    await waitFor(() => expect(usernameError).toBeInTheDocument());
    await waitFor(() => expect(passwordError).toBeInTheDocument());
  });

  it('should log in the user and navigate to homepage if login is successful using button', async () => {
    render(<SignIn isLoggedIn={false} setIsLoggedIn={() => {}} />);

    const usernameInput = await screen.findByLabelText(/^signIn.username/i);
    const passwordInput = await screen.findByLabelText(/^signIn.enterPassword/i);
    userEvent.type(usernameInput, 'test');
    userEvent.type(passwordInput, 'test');

    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: {} } });
    const submitButton = await screen.findByText('signIn.continue');
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/home');
    });
  });

  it('should display an error if username is blank and login is attempted using button', async () => {
    render(<SignIn isLoggedIn={false} setIsLoggedIn={() => {}} />);

    const passwordInput = await screen.findByLabelText(/^signIn.enterPassword/i);
    userEvent.type(passwordInput, 'test');
    const submitButton = await screen.findByTestId('basic-auth-submit-btn');
    fireEvent.click(submitButton);

    await waitFor(() => expect(screen.queryByText(/enter a username/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText(/enter a password/i)).not.toBeInTheDocument());
    await waitFor(() => {
      expect(mockedUsedNavigate).not.toHaveBeenCalled();
    });
  });

  it('should display an error if password is blank and login is attempted using button', async () => {
    render(<SignIn isLoggedIn={false} setIsLoggedIn={() => {}} />);

    const usernameInput = await screen.findByLabelText(/^signIn.username/i);
    userEvent.type(usernameInput, 'test');
    const submitButton = await screen.findByTestId('basic-auth-submit-btn');
    fireEvent.click(submitButton);

    await waitFor(() => expect(screen.queryByText(/enter a username/i)).not.toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText(/enter a password/i)).toBeInTheDocument());
    await waitFor(() => {
      expect(mockedUsedNavigate).not.toHaveBeenCalled();
    });
  });

  it('should display an error if username and password are both blank and login is attempted using button', async () => {
    render(<SignIn isLoggedIn={false} setIsLoggedIn={() => {}} />);

    const submitButton = await screen.findByTestId('basic-auth-submit-btn');
    fireEvent.click(submitButton);

    await waitFor(() => expect(screen.queryByText(/enter a username/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText(/enter a password/i)).toBeInTheDocument());
    await waitFor(() => {
      expect(mockedUsedNavigate).not.toHaveBeenCalled();
    });
  });

  it('should log in the user and navigate to homepage if login is successful using enter key on username field', async () => {
    render(<SignIn isLoggedIn={false} setIsLoggedIn={() => {}} />);

    const usernameInput = await screen.findByLabelText(/^signIn.username/i);
    const passwordInput = await screen.findByLabelText(/^signIn.enterPassword/i);
    userEvent.type(usernameInput, 'test');
    userEvent.type(passwordInput, 'test');

    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: {} } });
    userEvent.type(usernameInput, '{enter}');
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/home');
    });
  });

  it('should log in the user and navigate to homepage if login is successful using enter key on password field', async () => {
    render(<SignIn isLoggedIn={false} setIsLoggedIn={() => {}} />);

    const usernameInput = await screen.findByLabelText(/^signIn.username/i);
    const passwordInput = await screen.findByLabelText(/^signIn.enterPassword/i);
    userEvent.type(usernameInput, 'test');
    userEvent.type(passwordInput, 'test');

    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: {} } });
    userEvent.type(passwordInput, '{enter}');
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/home');
    });
  });

  it('should display an error if username is blank and login is attempted using enter key', async () => {
    render(<SignIn isLoggedIn={false} setIsLoggedIn={() => {}} />);

    const passwordInput = await screen.findByLabelText(/^signIn.enterPassword/i);
    userEvent.type(passwordInput, 'test');
    userEvent.type(passwordInput, '{enter}');

    await waitFor(() => expect(screen.queryByText(/enter a username/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText(/enter a password/i)).not.toBeInTheDocument());
    await waitFor(() => {
      expect(mockedUsedNavigate).not.toHaveBeenCalled();
    });
  });

  it('should display an error if password is blank and login is attempted using enter key', async () => {
    render(<SignIn isLoggedIn={false} setIsLoggedIn={() => {}} />);

    const usernameInput = await screen.findByLabelText(/^signIn.username/i);
    userEvent.type(usernameInput, 'test');
    userEvent.type(usernameInput, '{enter}');

    await waitFor(() => expect(screen.queryByText(/enter a username/i)).not.toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText(/enter a password/i)).toBeInTheDocument());
    await waitFor(() => {
      expect(mockedUsedNavigate).not.toHaveBeenCalled();
    });
  });

  it('should display an error if username and password are both blank and login is attempted using enter key', async () => {
    render(<SignIn isLoggedIn={false} setIsLoggedIn={() => {}} />);

    const passwordInput = await screen.findByLabelText(/^signIn.enterPassword/i);
    userEvent.type(passwordInput, '{enter}');

    await waitFor(() => expect(screen.queryByText(/enter a username/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText(/enter a password/i)).toBeInTheDocument());
    await waitFor(() => {
      expect(mockedUsedNavigate).not.toHaveBeenCalled();
    });
  });

  it('should should display login error if login not successful', async () => {
    render(<SignIn isLoggedIn={false} setIsLoggedIn={() => {}} />);

    const usernameInput = await screen.findByLabelText(/^signIn.username/i);
    const passwordInput = await screen.findByLabelText(/^signIn.enterPassword/i);
    userEvent.type(usernameInput, 'test');
    userEvent.type(passwordInput, 'test');

    jest.spyOn(api, 'get').mockRejectedValue({ status: 401, data: {} });

    const submitButton = await screen.findByText('signIn.continue');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/signIn.authFailed/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(mockedUsedNavigate).not.toHaveBeenCalled();
    });
  });
});
