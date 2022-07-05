import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';

let inMemoryUserRepository: InMemoryUsersRepository;
let userAuthTokenUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Create a User Auth Token", () => {

  beforeEach(async () => {

    inMemoryUserRepository = new InMemoryUsersRepository();
    userAuthTokenUseCase = new AuthenticateUserUseCase(inMemoryUserRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
  });

  test("Should be able create User Auth Token", async () => {

    const user = {

      name: "User Name Test",
      email: "User Email Test",
      password: "User Password Test"
    }

    const { name, email, password } = user;

    const createAndRequireUser = await createUserUseCase
      .execute({ name, email, password });

    expect(createAndRequireUser)
      .toHaveProperty("id");

    const authToken = await userAuthTokenUseCase
      .execute({
        email: "User Email Test",
        password: "User Password Test"
      });

    expect(authToken)
      .toHaveProperty("user");
  });
});
