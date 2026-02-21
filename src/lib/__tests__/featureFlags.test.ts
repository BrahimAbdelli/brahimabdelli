describe('featureFlags', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('defaults useNotion to false when env var is not set', () => {
    delete process.env['NEXT_PUBLIC_FEATURE_USE_NOTION'];
    const { featureFlags } = require('src/lib/featureFlags');
    expect(featureFlags.useNotion).toBe(false);
  });

  it('sets useNotion to true when env var is "true"', () => {
    process.env['NEXT_PUBLIC_FEATURE_USE_NOTION'] = 'true';
    const { featureFlags } = require('src/lib/featureFlags');
    expect(featureFlags.useNotion).toBe(true);
  });

  it('sets useNotion to false when env var is any other value', () => {
    process.env['NEXT_PUBLIC_FEATURE_USE_NOTION'] = 'false';
    const { featureFlags } = require('src/lib/featureFlags');
    expect(featureFlags.useNotion).toBe(false);
  });

  it('is frozen and cannot be mutated', () => {
    const { featureFlags } = require('src/lib/featureFlags');
    expect(Object.isFrozen(featureFlags)).toBe(true);
  });
});
