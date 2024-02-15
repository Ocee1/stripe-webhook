import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserEntity } from './user.entity';
import { Model } from 'mongoose';
import { UserResponseType } from './types/userResponse.types';
import { SignInDto } from './dto/signIn.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/userDto.dto';
import { ConfigService } from '@nestjs/config';
// import { JwtService } from '@nestjs/jwt'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserEntity.name)
    private userModel: Model<UserEntity>,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = await this.userModel.findOne({ email: createUserDto.email });
    if (user) {
      throw new HttpException(
        'Email is already taken!',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const createdUser = new this.userModel(createUserDto);

    return await createdUser.save();
  }

  async signInUser(signInDto: SignInDto) {
    const user = await this.userModel
      .findOne({ email: signInDto.email })
      .select('+password');

    if (!user) {
      throw new HttpException(
        'User not found!',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isPasswordMatch = await compare(signInDto.password, user.password);

    if (!isPasswordMatch) {
      throw new HttpException(
        'Incorrect Password',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return user;
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.userModel.findById(id).select('-password');

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    
    if (
      updateUserDto.email &&
      updateUserDto.email !== user.email &&
      (await this.userModel.findOne({ email: updateUserDto.email }))
    ) {
      throw new HttpException('Email already in use', HttpStatus.UNPROCESSABLE_ENTITY);
    }


    Object.assign(user, updateUserDto);
    return await user.save();
  }

  userResponse(userEntity: UserEntity): UserResponseType {
    return {
      username: userEntity.username,
      email: userEntity.email,
      token: this.generateJwt(userEntity),
    };
  }

  generateJwt(userEntity: any): string {
    return this.jwtService.sign(
      { email: userEntity.email },
      { expiresIn: this.configService.get('EXPIRES_IN'), secret: this.configService.get('JWT_SECRET') },
    );
  }

  // findAll() {
  //   return `This action returns all user`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
