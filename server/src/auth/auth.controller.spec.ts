import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { createMock } from "@golevelup/ts-jest";

describe("AuthController", () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    })
      .useMocker(() => createMock())
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
