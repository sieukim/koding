import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { createMock } from "@golevelup/ts-jest";

describe("UsersService", () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    })
      .useMocker(() => createMock())
      .compile();

    service = module.get<UsersService>(UsersService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
