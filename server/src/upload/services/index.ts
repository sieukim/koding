import { S3Service } from "./s3.service";
import { PostImageUploadService } from "./post-image-upload.service";
import { ProfileAvatarUploadService } from "./profile-avatar-upload.service";

export const UploadServices = [
  S3Service,
  PostImageUploadService,
  ProfileAvatarUploadService,
];
