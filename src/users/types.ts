export interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

export type CreateUserData = Omit<User, 'id'>;
