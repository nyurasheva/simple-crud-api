export interface CreateUserData {
  username: string;
  age: number;
  hobbies: string[];
}

export interface User extends CreateUserData {
  id: string;
}
