import { expect, it, suite } from 'vitest';
import { mockNuxtImport, renderSuspended } from '@nuxt/test-utils/runtime';
import { screen } from '@testing-library/vue';
import OnlineIndicator from '../../components/OnlineIndicator.vue';

suite('OnlineIndicator', () => {
  it('renders correctly', async () => {
    await renderSuspended(OnlineIndicator);

    expect(screen.getByTestId('online-indicator')).toBeDefined();
  });

  it('shows offline indicator correctly when offline', async () => {
    mockNuxtImport('useNetwork', () => () => {
      const value = ref(false);

      return value;
    });

    await renderSuspended(OnlineIndicator);

    expect(screen.getByTestId('online-indicator').className).toEqual('online-indicator offline');
  });
});
