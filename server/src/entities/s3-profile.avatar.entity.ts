import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { UUIDPrimaryColumn } from "./utils/uuid-column.decorator";
import { NicknameColumn } from "./utils/nickname-column.decorator";
import { User } from "./user.entity";
import { v4 } from "uuid";
import { getCurrentTime } from "../common/utils/time.util";
import { TableName } from "./table-name.enum";

@Index(["s3FileUrl"], { unique: true })
@Index(["uploaderNickname"])
@Entity({ name: TableName.S3ProfileAvatar })
export class S3ProfileAvatar {
  public static readonly EXPIRE_HOUR = 1;
  @UUIDPrimaryColumn()
  id: string = v4();
  @Column("varchar", { length: 150 })
  s3FileUrl: string;
  @Column("varchar", { length: 50 })
  s3FileKey: string;
  @NicknameColumn({ nullable: true })
  uploaderNickname: string | null;
  @JoinColumn({ name: "uploaderNickname", referencedColumnName: "nickname" })
  @ManyToOne(() => User, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
    nullable: true,
  })
  uploader?: User | null;
  @Column("timestamp")
  createdAt: Date;

  constructor(param?: { s3FileUrl: string; s3FileKey: string }) {
    if (param) {
      this.id = v4();
      this.s3FileKey = param.s3FileKey;
      this.s3FileUrl = param.s3FileUrl;
      this.uploaderNickname = null;
      this.createdAt = getCurrentTime();
    }
  }
}
