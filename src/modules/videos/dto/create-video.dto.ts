/* eslint-disable */
import { IsEnum, IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { AccessLevel } from 'src/generated/prisma/client';
import { ValidationMessage } from 'src/common/constants/validation.messages';

export class CreateVideoDto {
  @IsString()
  @IsNotEmpty({ message: ValidationMessage.VIDEO.TITLE_REQUIRED })
  title!: string;

  @IsString()
  @IsNotEmpty({ message: ValidationMessage.VIDEO.DRIVE_FILE_ID_REQUIRED })
  driveFileId!: string;

  @IsUrl({}, { message: ValidationMessage.VIDEO.EMBED_URL_INVALID })
  @IsNotEmpty({ message: ValidationMessage.VIDEO.EMBED_URL_REQUIRED })
  embedUrl!: string;

  @IsEnum(AccessLevel, {
    message: ValidationMessage.VIDEO.ACCESS_LEVEL_INVALID,
  })
  @IsNotEmpty({ message: ValidationMessage.VIDEO.ACCESS_LEVEL_REQUIRED })
  accessLevel!: AccessLevel;
}
