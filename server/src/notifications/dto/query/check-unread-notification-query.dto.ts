import { Equals, IsBoolean } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { BooleanTransform } from "../../../common/decorator/boolean-transform.decorator";

export class CheckUnreadNotificationQueryDto {
  @Equals(false)
  @IsBoolean()
  @ApiProperty({
    description: "알림을 읽은 여부. 고정적으로 false",
    enum: [false],
    type: Boolean,
  })
  @BooleanTransform(true)
  read: boolean;
}
