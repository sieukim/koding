import { IntersectionType } from "@nestjs/swagger";
import { WithPrevCursorDto } from "../with-prev-cursor.dto";
import { WithNextCursorDto } from "./with-next-cursor.dto";

export class WithCursorResponseDto extends IntersectionType(
  WithPrevCursorDto,
  WithNextCursorDto,
) {}
