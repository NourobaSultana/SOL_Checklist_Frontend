import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';

import { RegisterDto } from '../users/dto/register.dto';

import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,

    private readonly jwtService: JwtService,
  ) {}

  // Register
  async register(registerDto: RegisterDto) {
    const user = await this.usersService.createUser(registerDto);

    return {
      message: 'User registered successfully',
      user,
    };
  }

  // Login
  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(
      loginDto.email,
    );

    if (!user) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    const isMatch = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

   const payload = {
  sub: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
};
    return {
      access_token: this.jwtService.sign(payload),

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}