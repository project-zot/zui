# Problem Statement

Describe an initial _minimum viable product_ (MVP) workflow for the initial integration.

# Deployment Assumptions

1. UI is colocated with backend so both the datapath and UI is served on the same port.

2. Configuration is static and authentication may or may not be enabled.

# User Story

**U1**: User launches the `zot+zui` registry either as binary or a container image.

**U2**: If authentication is enabled in the `zot` configuration, then the initial screen is a login requiring username/password.

**U3**: If authentication is not successful, return back to the login screen.

**U4**: If authentication is successful, then return a list of all images and a search bar.

**U5**: In the search bar, user can type in a image name and results will be displayed.

**U6**: User can select a particular image and details of the image are returned.

**U7**: User should be able to logout.
