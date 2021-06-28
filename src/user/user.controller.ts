import { CreateUserDto } from './dto/create-user.dto';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ReadUserDto } from './dto/read-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<ReadUserDto[]> {
    return this.userService.findAll();
  }

  @Post()
  async create(@Body() user: CreateUserDto): Promise<ReadUserDto> {
    return this.userService.create(user);
  }
}
