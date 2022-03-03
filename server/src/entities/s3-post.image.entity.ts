import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { UUIDColumn, UUIDPrimaryColumn } from "./utils/uuid-column.decorator";
import { NicknameColumn } from "./utils/nickname-column.decorator";
import { Post } from "./post.entity";
import { User } from "./user.entity";
import { v4 } from "uuid";
import { getCurrentTime } from "../common/utils/time.util";
import { TableName } from "./table-name.enum";

@Index(["s3FileUrl"], { unique: true })
@Index(["createdAt", "postId"])
@Entity({ name: TableName.S3PostImage })
export class S3PostImage {
  public static readonly EXPIRE_HOUR = 2;
  @UUIDPrimaryColumn()
  id: string = v4();
  @UUIDColumn({ nullable: true })
  postId: string | null = null;
  @JoinColumn({ name: "postId", referencedColumnName: "postId" })
  @ManyToOne(() => Post, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
    nullable: true,
  })
  post?: Post | null;
  @Column("varchar", { length: 150 })
  s3FileUrl: string;
  @Column("varchar", { length: 50 })
  s3FileKey: string;
  @NicknameColumn()
  uploaderNickname: string;
  @JoinColumn({ name: "uploaderNickname", referencedColumnName: "nickname" })
  @ManyToOne(() => User, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  uploader?: User;
  @Column("timestamp")
  createdAt: Date;

  constructor(param?: {
    s3FileUrl: string;
    s3FileKey: string;
    uploaderNickname: string;
  }) {
    if (param) {
      this.id = v4();
      this.s3FileUrl = param.s3FileUrl;
      this.s3FileKey = param.s3FileKey;
      this.uploaderNickname = param.uploaderNickname;
      this.postId = null;
      this.createdAt = getCurrentTime();
    }
  }
}
