import { Injectable } from '@nestjs/common';

export type Collection = 'users' | 'applications';

/**
 * Simple in-memory store, drop-in replacement for SheetsService while the
 * Apps Script web app is not yet deployed. Survives only for the lifetime
 * of the Node process.
 */
@Injectable()
export class MemoryStore {
  private readonly data: Record<Collection, Map<string, Record<string, unknown>>> = {
    users: new Map(),
    applications: new Map(),
  };

  list<T>(c: Collection): T[] {
    return Array.from(this.data[c].values()) as T[];
  }

  findById<T>(c: Collection, id: string): T | null {
    return (this.data[c].get(id) as T) ?? null;
  }

  findBy<T>(c: Collection, where: Record<string, unknown>): T | null {
    const keys = Object.keys(where);
    for (const row of this.data[c].values()) {
      if (keys.every((k) => row[k] === where[k])) return row as T;
    }
    return null;
  }

  insert<T extends { id: string }>(c: Collection, row: T): T {
    this.data[c].set(row.id, row as unknown as Record<string, unknown>);
    return row;
  }

  update<T>(c: Collection, id: string, patch: Partial<T>): T | null {
    const current = this.data[c].get(id);
    if (!current) return null;
    const merged = { ...current, ...patch } as Record<string, unknown>;
    this.data[c].set(id, merged);
    return merged as T;
  }

  remove(c: Collection, id: string): boolean {
    return this.data[c].delete(id);
  }
}
