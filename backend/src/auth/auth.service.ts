import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { MemoryStore } from '../store/memory-store.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './jwt.strategy';

interface UserRow {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
}

export interface AuthResult {
  token: string;
  accessToken: string;
  user: { id: string; email: string; name: string };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly store: MemoryStore,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResult> {
    const existing = this.store.findBy<UserRow>('users', {
      email: dto.email.toLowerCase(),
    });
    if (existing) throw new ConflictException('Email already registered');
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const row: UserRow = {
      id: randomUUID(),
      email: dto.email.toLowerCase(),
      name: dto.name,
      passwordHash,
      createdAt: new Date().toISOString(),
    };
    this.store.insert('users', row);
    return this.sign(row);
  }

  async login(dto: LoginDto): Promise<AuthResult> {
    const user = this.store.findBy<UserRow>('users', {
      email: dto.email.toLowerCase(),
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return this.sign(user);
  }

  private sign(user: UserRow): AuthResult {
    const payload: JwtPayload = { sub: user.id, email: user.email };
    const token = this.jwt.sign(payload);
    return {
      token,
      accessToken: token,
      user: { id: user.id, email: user.email, name: user.name },
    };
  }
}
