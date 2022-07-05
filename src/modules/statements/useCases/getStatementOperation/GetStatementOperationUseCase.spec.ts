import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { GetStatementOperationUseCase } from "../getStatementOperation/GetStatementOperationUseCase";

import { OperationType } from '../../entities/Statement';

let inMemoryStatementRepository: InMemoryStatementsRepository;
let inMemoryUserRepository: InMemoryUsersRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statements Operations", () => {

  beforeEach(async () => {

    inMemoryStatementRepository = new InMemoryStatementsRepository();
    inMemoryUserRepository = new InMemoryUsersRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUserRepository, inMemoryStatementRepository);

  });

  test("Should be able Get Statements Operations", async () => {

    const user = {
      name: "User Name Test",
      email: "User Email Test",
      password: "User Password Test"
    }

    const { name, email, password } = user;

    const createAndRequireUser = await inMemoryUserRepository
      .create({ name, email, password });

    expect(createAndRequireUser)
      .toHaveProperty("id");

    const statement = {
      user_id: createAndRequireUser.id,
      description: "Back-End Freelancer project job",
      amount: 150000,
      type: OperationType.DEPOSIT
    }

    const { user_id, description, amount, type } = statement;

    if (user_id === undefined) {

      return undefined;
    }

    const createAndRequireStatement = await inMemoryStatementRepository
      .create({
        user_id: user_id,
        description: description,
        amount: amount,
        type: type
      });

    expect(createAndRequireStatement)
      .toHaveProperty("id");

    const { id } = createAndRequireStatement;

    if (id === undefined) {

      return undefined;
    }

    const requireStatements = await inMemoryStatementRepository
      .findStatementOperation({ user_id: user_id, statement_id: id });

    expect(requireStatements)
      .toMatchObject({
        amount: 150000,
        description: "Back-End Freelancer project job",
        id: id,
        type: "deposit",
        user_id: user_id
      });
  })
});