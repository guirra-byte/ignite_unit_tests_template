import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from './CreateUserUseCase'

let inMemoryUserRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create a new User", () => {

  beforeEach(async () => {

    inMemoryUserRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
  });

  test("Should be able create a new User", async () => {

    const user = {

      name: "User Name Test",
      email: "User Email Test",
      password: "User Password Test"
    }

    const { name, email, password } = user;

    const requireUser = await createUserUseCase
      .execute({ name: name, email: email, password: password });

    expect(requireUser)
      .toHaveProperty("id");

  });
});
