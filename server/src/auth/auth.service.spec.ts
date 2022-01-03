import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { createMock } from "@golevelup/ts-jest";

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService]
    }).useMocker(() => createMock()).compile();

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
