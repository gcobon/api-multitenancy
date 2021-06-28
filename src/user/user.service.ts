import { CreateUserDto } from './dto/create-user.dto';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { TENANT_CONNECTION } from 'src/tenancy/tenancy.provider';
import { ReadUserDto } from './dto/read-user.dto';
import { User } from './user.entity';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  private readonly userRepository: Repository<User>;

  constructor(@Inject(TENANT_CONNECTION) connection: Connection) {
    this.userRepository = connection.getRepository(User);
  }

  async findAll(): Promise<ReadUserDto[]> {
    const users = await this.userRepository.find();

    return users.map((user) => plainToClass(ReadUserDto, user));
  }

  async create(user: CreateUserDto): Promise<ReadUserDto> {
    const createdUser = await this.userRepository.save(user);

    return plainToClass(ReadUserDto, createdUser);
  }
}
