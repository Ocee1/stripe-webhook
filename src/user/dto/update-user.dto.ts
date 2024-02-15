import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './createUser.dto';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNotEmpty()
  readonly username?: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email?: string;

  @IsNotEmpty()
  readonly password?: string;
}
