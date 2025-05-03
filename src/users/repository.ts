import { User } from './types';

export class MemoryRepository<T extends { id: string }> {
  private data = new Map<string, T>();

  create(item: T): T {
    this.data.set(item.id, item);
    return item;
  }

  findAll(): T[] {
    return Array.from(this.data.values());
  }

  findById(id: string): T | undefined {
    return this.data.get(id);
  }

  update(id: string, item: Omit<T, 'id'>): T | undefined {
    if (!this.data.has(id)) return undefined;
    const updated = { id, ...item } as T;
    this.data.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.data.delete(id);
  }
}

export const memoryRepository = new MemoryRepository<User>();
