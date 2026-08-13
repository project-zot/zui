import { render, screen } from '@testing-library/react';
import React from 'react';
import MockThemeProvider from '__mocks__/MockThemeProvider';
import OciImage, { getConsistentImage, imageArray } from 'components/Shared/OciImage';

// Modify imageArray to have distinct values for testing
imageArray[0] = 'img1';
imageArray[1] = 'img2';
imageArray[2] = 'img3';
imageArray[3] = 'img4';

describe('OciImage component and getConsistentImage utility', () => {
  describe('getConsistentImage', () => {
    it('should return the same image for the same digest', () => {
      const digest = 'sha256:1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
      const image1 = getConsistentImage(digest, 'name1');
      const image2 = getConsistentImage(digest, 'name2');
      expect(image1).toBe(image2);
    });

    it('should return the same image for the same name when digest is missing', () => {
      const name = 'test-image';
      const image1 = getConsistentImage(null, name);
      const image2 = getConsistentImage(undefined, name);
      expect(image1).toBe(image2);
    });

    it('should return the default image when both digest and name are missing', () => {
      const image = getConsistentImage(null, null);
      expect(image).toBeDefined();
    });

    it('should produce different images for different inputs (probabilistic)', () => {
      const results = new Set();
      for (let i = 0; i < 20; i++) {
        results.add(getConsistentImage(`digest-${i}`, `name-${i}`));
      }
      // With 4 images, 20 random inputs should highly likely hit more than one image.
      // Since it's deterministic hash, it should hit multiple images.
      expect(results.size).toBeGreaterThan(1);
    });
  });

  describe('OciImage component', () => {
    it('should render the logo if provided', () => {
      const logo = 'base64logo';
      render(
        <MockThemeProvider>
          <OciImage logo={logo} alt="test-alt" />
        </MockThemeProvider>
      );
      const img = screen.getByAltText('test-alt');
      expect(img).toHaveAttribute('src', `data:image/png;base64, ${logo}`);
    });

    it('should render a consistent image if logo is missing', () => {
      const digest = 'sha256:abc';
      const name = 'test-repo';
      render(
        <MockThemeProvider>
          <OciImage digest={digest} name={name} alt="test-alt" />
        </MockThemeProvider>
      );
      const img = screen.getByAltText('test-alt');
      const expectedImage = getConsistentImage(digest, name);
      expect(img).toHaveAttribute('src', expectedImage);
    });

    it('should prioritize digest over name for consistency', () => {
      const digest = 'sha256:abc';
      const name1 = 'repo1';
      const name2 = 'repo2';
      const { rerender } = render(
        <MockThemeProvider>
          <OciImage digest={digest} name={name1} alt="test-alt" />
        </MockThemeProvider>
      );
      const img1 = screen.getByAltText('test-alt').getAttribute('src');
      rerender(
        <MockThemeProvider>
          <OciImage digest={digest} name={name2} alt="test-alt" />
        </MockThemeProvider>
      );
      const img2 = screen.getByAltText('test-alt').getAttribute('src');
      expect(img1).toBe(img2);
    });
  });
});
