import { Repository } from 'typeorm';
import { User } from './entitites/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

export class UserService {
  constructor(private userRepository: Repository<User>) {}

  async getUsers() {
    return await this.userRepository.find();
  }

  async createUser(dto: CreateUserDto) {
    const user = this.userRepository.create(dto);
    return await this.userRepository.save(user);
  }
}
