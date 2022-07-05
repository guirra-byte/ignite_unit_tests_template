import { inject, injectable } from "tsyringe";
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import authConfig from '../../../../config/auth';

import { IUsersRepository } from "../../repositories/IUsersRepository";
import { IAuthenticateUserResponseDTO } from "./IAuthenticateUserResponseDTO";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

interface IRequest {
  email: string;
  password: string;
}

export const passwordKey: string = "f750766d2e4617e94eb4f943625ceeaa";

interface IRequestRequireProps {

  user: {

    name: string,
    email: string,
    id?: string
  },
  token: string
}

// @injectable()
export class AuthenticateUserUseCase {
  constructor(
    // @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) { }

  async execute({ email, password }: IRequest): Promise<IAuthenticateUserResponseDTO> {
    const user = await this.usersRepository.findByEmail(email);

    if (user === undefined) {
      throw new IncorrectEmailOrPasswordError();
    }

    const passwordMatch = await compare(password, user.password);

    if (passwordMatch === undefined) {
      throw new IncorrectEmailOrPasswordError();
    }

    const token = sign({}, passwordKey, {
      subject: user.id,
      expiresIn: "1d",
    });

    const requireToken: IRequestRequireProps = {

      user: {

        name: user.name,
        email: user.email,
        id: user.id
      },
      token: token
    }

    return requireToken;
  }
}
