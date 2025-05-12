import { MemoryRepository } from '../users/repository';

interface User {
  id: string;
  username: string;
  age: number;
}

describe('MemoryRepository', () => {
  let repository: MemoryRepository<User>;

  beforeEach(() => {
    repository = new MemoryRepository<User>();
  });

  it('should create a user', () => {
    const user = { id: '1', username: 'JohnDoe', age: 30 };
    const createdUser = repository.create(user);

    expect(createdUser).toEqual(user);
  });

  it('should find a user by ID', () => {
    const user = { id: '1', username: 'JohnDoe', age: 30 };
    repository.create(user);

    const foundUser = repository.findById('1');
    expect(foundUser).toEqual(user);
  });

  it('should return undefined for non-existent user', () => {
    const foundUser = repository.findById('non-existent-id');
    expect(foundUser).toBeUndefined();
  });

  it('should update a user', () => {
    const user = { id: '1', username: 'JohnDoe', age: 30 };
    repository.create(user);

    const updatedUser = repository.update('1', {
      username: 'JaneDoe',
      age: 31,
    });

    expect(updatedUser).toEqual({ id: '1', username: 'JaneDoe', age: 31 });
  });

  it('should return undefined if trying to update non-existent user', () => {
    const updatedUser = repository.update('non-existent-id', {
      username: 'JaneDoe',
    });
    expect(updatedUser).toBeUndefined();
  });

  it('should delete a user', () => {
    const user = { id: '1', username: 'JohnDoe', age: 30 };
    repository.create(user);

    const success = repository.delete('1');
    expect(success).toBe(true);
  });

  it('should return false if trying to delete a non-existent user', () => {
    const success = repository.delete('non-existent-id');
    expect(success).toBe(false);
  });
});
