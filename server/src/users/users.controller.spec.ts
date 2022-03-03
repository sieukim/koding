import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { createMock } from "@golevelup/ts-jest";

describe("UsersController", () => {
  let usersController: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
    })
      .useMocker((token) => createMock())
      .compile();

    usersController = module.get<UsersController>(UsersController);
  });

  describe("joinUser", () => {
    // it("should return user without auth info", async () => {
    //   const user = new UserDocument();
    //   user.email = "test@test.com";
    //   user.nickname = "test";
    //   user.password = "11111111";
    //   user.githubUrl = "https://github.com/test";
    //   const { password, ...userWithoutPassword } = user;
    //   jest
    //     .spyOn(usersService, "signupLocal")
    //     .mockImplementation(async () => user);
    //   expect(await usersController.joinUser(user)).toEqual(userWithoutPassword);
    // });
  });
});
