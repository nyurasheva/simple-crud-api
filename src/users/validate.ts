import { CreateUserData } from './types';

export function isValidUserData(data: unknown): data is CreateUserData {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof (data as CreateUserData).username === 'string' &&
    typeof (data as CreateUserData).age === 'number' &&
    Array.isArray((data as CreateUserData).hobbies) &&
    (data as CreateUserData).hobbies.every((hobby) => typeof hobby === 'string')
  );
}
