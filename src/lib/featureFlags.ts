import { z } from 'zod';

const FeatureFlagsSchema = z.object({
  useNotion: z.boolean(),
});

type FeatureFlags = z.infer<typeof FeatureFlagsSchema>;

const flags: FeatureFlags = FeatureFlagsSchema.parse({
  useNotion: process.env['NEXT_PUBLIC_FEATURE_USE_NOTION'] === 'true',
});

export const featureFlags: Readonly<FeatureFlags> = Object.freeze(flags);
