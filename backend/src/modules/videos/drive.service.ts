import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { VideoClass } from 'src/generated/prisma/client';

@Injectable()
export class DriveService {
  private auth;

  constructor() {
    this.auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_PATH,
      scopes: ['https://www.googleapis.com/auth/drive'],
    });
  }

  getFolderIdForClass(videoClass: VideoClass): string | null {
    return videoClass === VideoClass.CLASS_A
      ? process.env.GOOGLE_DRIVE_FOLDER_CLASS_A ?? null
      : process.env.GOOGLE_DRIVE_FOLDER_CLASS_B ?? null;
  }

  getPreviewUrl(driveFileId: string): string {
    return `https://drive.google.com/file/d/${driveFileId}/preview?authuser=0`;
  }

  async listFileIdsInFolder(folderId: string): Promise<Set<string>> {
    const drive = google.drive({ version: 'v3', auth: this.auth });
    const fileIds = new Set<string>();
    let pageToken: string | undefined;

    do {
      const response = await drive.files.list({
        q: `'${folderId}' in parents and trashed = false and mimeType != 'application/vnd.google-apps.folder'`,
        fields: 'nextPageToken, files(id)',
        pageToken,
      });

      for (const file of response.data.files ?? []) {
        if (file.id) {
          fileIds.add(file.id);
        }
      }

      pageToken = response.data.nextPageToken ?? undefined;
    } while (pageToken);

    return fileIds;
  }

  async grantClassFolderAccess(
    videoClass: VideoClass,
    email: string,
  ): Promise<void> {
    const folderId = this.getFolderIdForClass(videoClass);
    if (!folderId) return;
    await this.grantAccess(folderId, email);
  }

  async grantAccess(driveFileId: string, email: string): Promise<void> {
    const drive = google.drive({ version: 'v3', auth: this.auth });

    try {
      await drive.permissions.create({
        fileId: driveFileId,
        sendNotificationEmail: false,
        requestBody: {
          type: 'user',
          role: 'reader',
          emailAddress: email,
        },
      });
    } catch (error: any) {
      const message = String(error?.message ?? '');
      if (message.includes('already exists') || error?.code === 403) {
        return;
      }
      throw error;
    }
  }

  async revokeAccess(driveFileId: string, email: string): Promise<void> {
    const drive = google.drive({ version: 'v3', auth: this.auth });

    const permissions = await drive.permissions.list({
      fileId: driveFileId,
      fields: 'permissions(id, emailAddress)',
    });

    const permission = permissions.data.permissions?.find(
      (p) => p.emailAddress === email,
    );

    if (permission?.id) {
      await drive.permissions.delete({
        fileId: driveFileId,
        permissionId: permission.id,
      });
    }
  }
}
