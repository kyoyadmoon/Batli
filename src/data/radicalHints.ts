import radicalHintsData from './radicalHints.json';

export interface RadicalHint {
  readonly radical: string;
  readonly hint: string;
}

const hints = radicalHintsData as Record<string, RadicalHint>;

export function getRadicalHint(character: string): RadicalHint | undefined {
  return hints[character];
}
