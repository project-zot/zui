// Mock for SVG imports in Jest tests
// This prevents SVG files from being treated as objects and allows them to be used as strings

const SvgMock = 'test-file-stub';

export default SvgMock;

// Also export as a React component for cases where SVG is used as a component
export const ReactComponent = () => 'svg';
