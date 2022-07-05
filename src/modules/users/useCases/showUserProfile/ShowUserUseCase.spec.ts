import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";
import { AuthenticateUserUseCase } from '../authenticateUser/AuthenticateUserUseCase';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';

let inMemoryUserRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let userAuthTokenUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Show User Profile", () => {

  beforeEach(async () => {

    inMemoryUserRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUserRepository);
    userAuthTokenUseCase = new AuthenticateUserUseCase(inMemoryUserRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);

  });

  test("Should be able Show User Profile", async () => {

    const user = {

      name: "User Name Test",
      email: "User Email Test",
      password: "User Password Test"
    }

    const { name, email, password } = user;

    const createAndRequireUser = await createUserUseCase
      .execute({ name: name, email: email, password: password });

    expect(createAndRequireUser)
      .toHaveProperty("id");

    const requireUserAuthToken = await userAuthTokenUseCase
      .execute({
        email: createAndRequireUser.email,
        password: createAndRequireUser.password
      });

    expect(requireUserAuthToken)
      .toHaveProperty("token");

    const { id } = requireUserAuthToken.user

    if (id === undefined) {

      return undefined;
    }

    const requireUserProfile = await showUserProfileUseCase
      .execute(id);

    console.log(requireUserProfile);

    expect(requireUserProfile)
      .toHaveProperty("id");

  });
});