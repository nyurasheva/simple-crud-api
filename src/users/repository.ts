import { User } from './types';

export class MemoryRepository {
  private users = new Map<string, User>();

  create(user: User): User {
    this.users.set(user.id, user);
    return user;
  }

  findAll(): User[] {
    return Array.from(this.users.values());
  }

  findById(id: string): User | undefined {
    return this.users.get(id);
  }

  update(id: string, user: Omit<User, 'id'>): User | undefined {
    if (!this.users.has(id)) return undefined;
    const updated = { id, ...user };
    this.users.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.users.delete(id);
  }
}

export const memoryRepository = new MemoryRepository();
