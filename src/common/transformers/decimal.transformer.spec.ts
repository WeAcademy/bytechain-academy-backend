import { decimalToNumber } from './decimal.transformer';

describe('decimalToNumber', () => {
  it('turns the strings PostgreSQL returns into numbers', () => {
    expect(decimalToNumber.from('100.00')).toBe(100);
    expect(decimalToNumber.from('66.67')).toBe(66.67);
    expect(decimalToNumber.from('0.00')).toBe(0);
  });

  it('leaves numbers alone and passes null and undefined through', () => {
    expect(decimalToNumber.from(87.5)).toBe(87.5);
    expect(decimalToNumber.from(null)).toBeNull();
    expect(decimalToNumber.from(undefined)).toBeUndefined();
  });

  it('writes the value unchanged', () => {
    expect(decimalToNumber.to(66.67)).toBe(66.67);
    expect(decimalToNumber.to(null)).toBeNull();
  });
});
