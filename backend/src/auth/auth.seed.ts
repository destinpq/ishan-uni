import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { MemoryStore } from '../store/memory-store.service';

interface UserRow {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
}

const ADMIN_EMAIL = 'admin@unitrack.local';
const ADMIN_PASSWORD = 'admin@123';
const ADMIN_NAME = 'Admin';

@Injectable()
export class AuthSeed implements OnModuleInit {
  private readonly logger = new Logger(AuthSeed.name);
  constructor(private readonly store: MemoryStore) {}

  async onModuleInit(): Promise<void> {
    const existing = this.store.findBy<UserRow>('users', { email: ADMIN_EMAIL });
    if (existing) return;
    const row: UserRow = {
      id: randomUUID(),
      email: ADMIN_EMAIL,
      name: ADMIN_NAME,
      passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 10),
      createdAt: new Date().toISOString(),
    };
    this.store.insert('users', row);
    this.logger.log(`Seeded admin account: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  }
}
