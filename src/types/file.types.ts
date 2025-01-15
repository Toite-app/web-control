export interface IFile {
  id: string;
  groupId: string | null;
  originalName: string;
  mimeType: string;
  extension: string;
  bucketName: string;
  region: string;
  endpoint: string;
  size: number;
  uploadedByUserId: string | null;
  createdAt: Date;
}
