export class MemoryRepository<T extends { id: string }> {
  private storage: Map<string, T> = new Map();

  create(item: T): T {
    this.storage.set(item.id, item);
    return item;
  }

  findAll(): T[] {
    return Array.from(this.storage.values());
  }

  findById(id: string): T | undefined {
    return this.storage.get(id);
  }

  update(id: string, item: Partial<Omit<T, 'id'>>): T | undefined {
    const existing = this.storage.get(id);
    if (!existing) return undefined;

    const updated: T = { ...existing, ...item, id };
    this.storage.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.storage.delete(id);
  }
}
