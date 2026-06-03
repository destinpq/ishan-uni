import {
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export const APPLICATION_STATUSES = [
  'applied',
  'under_review',
  'accepted',
  'rejected',
  'waitlisted',
] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export class CreateApplicationDto {
  @IsString()
  @MinLength(1)
  @MaxLength(160)
  universityName!: string;

  @IsUrl({ require_protocol: true })
  universityWebsite!: string;

  @IsIn(APPLICATION_STATUSES)
  status!: ApplicationStatus;

  @IsDateString()
  appliedDate!: string;

  @IsDateString()
  deadline!: string;

  @IsOptional()
  @IsDateString()
  submissionDate?: string;

  @IsOptional()
  @IsDateString()
  decisionDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  scholarshipInfo?: string;
}
