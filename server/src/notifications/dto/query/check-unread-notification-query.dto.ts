import { Equals, IsBoolean } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";

export class CheckUnreadNotificationQueryDto {
  @Equals(false)
  @IsBoolean()
  @ApiProperty({
    description: "알림을 읽은 여부. 고정적으로 false",
    enum: [false],
    type: Boolean,
  })
  @Transform(({ value }) => {
    switch (value) {
      case true:
      case "true":
        return true;
      case false:
      case "false":
        return false;
      default:
        return value;
    }
  })
  read: boolean;
}
