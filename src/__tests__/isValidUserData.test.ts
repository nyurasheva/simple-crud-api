import { isValidUserData } from '../users/validate';
import { CreateUserData } from '../users/types';

describe('isValidUserData', () => {
  it('should return true for valid user data', () => {
    const validData: CreateUserData = {
      username: 'Alice',
      age: 30,
      hobbies: ['reading', 'gaming'],
    };
    expect(isValidUserData(validData)).toBe(true);
  });

  it('should return false for missing username', () => {
    const invalidData = {
      age: 30,
      hobbies: ['reading', 'gaming'],
    };
    expect(isValidUserData(invalidData)).toBe(false);
  });

  it('should return false for non-string username', () => {
    const invalidData = {
      username: 123,
      age: 30,
      hobbies: ['reading'],
    };
    expect(isValidUserData(invalidData)).toBe(false);
  });

  it('should return false for non-number age', () => {
    const invalidData = {
      username: 'Bob',
      age: 'thirty',
      hobbies: ['reading'],
    };
    expect(isValidUserData(invalidData)).toBe(false);
  });

  it('should return false for non-array hobbies', () => {
    const invalidData = {
      username: 'Charlie',
      age: 25,
      hobbies: 'reading',
    };
    expect(isValidUserData(invalidData)).toBe(false);
  });

  it('should return false if any hobby is not a string', () => {
    const invalidData = {
      username: 'Daisy',
      age: 22,
      hobbies: ['reading', 42],
    };
    expect(isValidUserData(invalidData)).toBe(false);
  });

  it('should return false for null', () => {
    expect(isValidUserData(null)).toBe(false);
  });

  it('should return false for non-object types', () => {
    expect(isValidUserData('string')).toBe(false);
    expect(isValidUserData(123)).toBe(false);
    expect(isValidUserData(true)).toBe(false);
  });
});
