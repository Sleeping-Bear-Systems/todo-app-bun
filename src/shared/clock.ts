export interface Clock {
  readonly now: () => Date;
}

export const systemClock: Clock = {
  now: () => new Date(),
} as const;

export function createFixedClock(now: Date): Clock {
  return {
    now: () => now,
  } as const;
}
