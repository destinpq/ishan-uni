import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { MemoryStore } from '../store/memory-store.service';
import {
  ApplicationStatus,
  CreateApplicationDto,
} from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

export interface Application {
  id: string;
  ownerId: string;
  universityName: string;
  universityWebsite: string;
  status: ApplicationStatus;
  appliedDate: string;
  deadline: string;
  submissionDate?: string;
  decisionDate?: string;
  scholarshipInfo?: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class ApplicationsService {
  constructor(private readonly store: MemoryStore) {}

  listForUser(ownerId: string): Application[] {
    return this.store
      .list<Application>('applications')
      .filter((a) => a.ownerId === ownerId);
  }

  create(ownerId: string, dto: CreateApplicationDto): Application {
    const now = new Date().toISOString();
    const row: Application = {
      id: randomUUID(),
      ownerId,
      createdAt: now,
      updatedAt: now,
      ...dto,
    };
    return this.store.insert('applications', row);
  }

  getOwned(ownerId: string, id: string): Application {
    const a = this.store.findById<Application>('applications', id);
    if (!a || a.ownerId !== ownerId) {
      throw new NotFoundException('Application not found');
    }
    return a;
  }

  update(
    ownerId: string,
    id: string,
    dto: UpdateApplicationDto,
  ): Application {
    this.getOwned(ownerId, id);
    const updated = this.store.update<Application>('applications', id, {
      ...dto,
      updatedAt: new Date().toISOString(),
    });
    if (!updated) throw new NotFoundException('Application not found');
    return updated;
  }

  remove(ownerId: string, id: string): void {
    this.getOwned(ownerId, id);
    this.store.remove('applications', id);
  }
}
