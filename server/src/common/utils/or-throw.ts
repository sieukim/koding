import { NotFoundException } from "@nestjs/common";

export const orThrowNotFoundUser = () => {
  throw new NotFoundException("잘못된 사용자");
};

export const orThrowNotFoundPost = () => {
  throw new NotFoundException("잘못된 게시글");
};

export const orThrowNotFoundComment = () => {
  throw new NotFoundException("잘못된 댓글");
};
