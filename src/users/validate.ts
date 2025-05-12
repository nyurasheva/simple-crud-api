import { CreateUserData } from './types';
import {
  isString,
  isPositiveNumber,
  isStringArray,
  isPlainObject,
} from '../utils/validators';

const ALLOWED_KEYS: (keyof CreateUserData)[] = ['username', 'age', 'hobbies'];

export function isValidUserData(data: unknown): data is CreateUserData {
  if (!isPlainObject(data)) return false;

  const keys = Object.keys(data);
  if (!keys.every((key) => (ALLOWED_KEYS as string[]).includes(key)))
    return false;

  const { username, age, hobbies } = data as unknown as CreateUserData;

  return isString(username) && isPositiveNumber(age) && isStringArray(hobbies);
}

export function isValidPutUserData(
  data: unknown
): data is Partial<CreateUserData> {
  if (!isPlainObject(data)) return false;

  const keys = Object.keys(data);
  if (!keys.every((key) => (ALLOWED_KEYS as string[]).includes(key)))
    return false;

  const { username, age, hobbies } = data as Partial<CreateUserData>;

  if (username !== undefined && !isString(username)) return false;
  if (age !== undefined && !isPositiveNumber(age)) return false;
  if (hobbies !== undefined && !isStringArray(hobbies)) return false;

  return true;
}
