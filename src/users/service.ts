import { v4 as uuidv4 } from 'uuid';
import { User } from './types';
import { memoryRepository } from './repository';

export const createUserService = (data: Omit<User, 'id'>): User => {
  const user: User = { id: uuidv4(), ...data };
  return memoryRepository.create(user);
};

export const getAllUsersService = (): User[] => {
  return memoryRepository.findAll();
};

export const getUserByIdService = (id: string): User | undefined => {
  return memoryRepository.findById(id);
};

export const updateUserService = (
  id: string,
  data: Omit<User, 'id'>
): User | undefined => {
  return memoryRepository.update(id, data);
};

export const deleteUserByIdService = (id: string): boolean => {
  return memoryRepository.delete(id);
};
