import { Equals, IsBoolean } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class MarkReadNotificationRequestDto {
  @Equals(true)
  @IsBoolean()
  @ApiProperty({
    description: "알람을 읽은 여부. 고정적으로 true",
    enum: [true],
    type: Boolean,
  })
  read: boolean;
}
