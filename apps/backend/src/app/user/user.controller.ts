import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('users')
@Controller('/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/')
  @ApiOperation({ summary: 'Get all users', description: 'Return all users' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all users',
    type: [UserResponseDto],
  })
  @HttpCode(HttpStatus.OK)
  async getUsers() {
    return this.userService.getUsers();
  }

  @Post('/')
  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The user has been successfully created',
    type: UserResponseDto,
  })
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }
}
