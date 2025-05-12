import { isValidUserData, isValidPutUserData } from '../users/validate';
import { CreateUserData } from '../users/types';

describe('isValidUserData', () => {
  it('should return true for valid full user data', () => {
    const validData: CreateUserData = {
      username: 'Alice',
      age: 30,
      hobbies: ['reading', 'gaming'],
    };
    expect(isValidUserData(validData)).toBe(true);
  });

  it('should return false if a required field is missing', () => {
    const missingUsername = {
      age: 30,
      hobbies: ['reading'],
    };
    expect(isValidUserData(missingUsername)).toBe(false);

    const missingAge = {
      username: 'Alice',
      hobbies: ['reading'],
    };
    expect(isValidUserData(missingAge)).toBe(false);

    const missingHobbies = {
      username: 'Alice',
      age: 30,
    };
    expect(isValidUserData(missingHobbies)).toBe(false);
  });

  it('should return false for negative age', () => {
    const invalidData = {
      username: 'Alice',
      age: -5,
      hobbies: ['reading'],
    };
    expect(isValidUserData(invalidData)).toBe(false);
  });

  it('should return false for invalid types', () => {
    expect(
      isValidUserData({ username: 123, age: 30, hobbies: ['reading'] })
    ).toBe(false);

    expect(
      isValidUserData({ username: 'Alice', age: '30', hobbies: ['reading'] })
    ).toBe(false);

    expect(
      isValidUserData({ username: 'Alice', age: 30, hobbies: 'reading' })
    ).toBe(false);
  });

  it('should return false for extra unexpected keys', () => {
    const dataWithExtra = {
      username: 'Alice',
      age: 30,
      hobbies: ['reading'],
      email: 'alice@example.com',
    };
    expect(isValidUserData(dataWithExtra)).toBe(false);
  });
});

describe('isValidPutUserData', () => {
  it('should return true for full valid data', () => {
    const data = {
      username: 'Bob',
      age: 40,
      hobbies: ['golf'],
    };
    expect(isValidPutUserData(data)).toBe(true);
  });

  it('should return true for partial valid data', () => {
    expect(isValidPutUserData({ username: 'Bob' })).toBe(true);
    expect(isValidPutUserData({ age: 25 })).toBe(true);
    expect(isValidPutUserData({ hobbies: ['fishing'] })).toBe(true);
  });

  it('should return false for invalid field values', () => {
    expect(isValidPutUserData({ username: 123 })).toBe(false);
    expect(isValidPutUserData({ age: -10 })).toBe(false);
    expect(isValidPutUserData({ hobbies: 'not-an-array' })).toBe(false);
    expect(isValidPutUserData({ hobbies: ['a', 2] })).toBe(false);
  });

  it('should return false for non-object input', () => {
    expect(isValidPutUserData(null)).toBe(false);
    expect(isValidPutUserData(123)).toBe(false);
    expect(isValidPutUserData('string')).toBe(false);
    expect(isValidPutUserData(['username'])).toBe(false);
  });

  it('should return false for unknown keys', () => {
    expect(isValidPutUserData({ email: 'bob@example.com' })).toBe(false);
    expect(isValidPutUserData({ username: 'Bob', extra: 123 })).toBe(false);
  });

  it('should return true for empty object (no update fields)', () => {
    expect(isValidPutUserData({})).toBe(true);
  });
});
