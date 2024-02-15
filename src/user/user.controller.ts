import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UserResponseType } from './types/userResponse.types';
import { SignInDto } from './dto/signIn.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/auth')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<any> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.userResponse(user);
  }
  @HttpCode(HttpStatus.OK)
  @Post('auth/signin')
  async signIn(
    @Body()
    signInDto: SignInDto,
  ) {
    const user = await this.userService.signInUser(signInDto);

    return { userId: user.id, token: this.userService.generateJwt(user.email) };
  }

  @UseGuards(AuthGuard)
  @Patch('user/:id')
  async update(
    @Param('id')
    id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    const user = await this.userService.updateUser(id, updateUserDto);

    return 'Updated Successfully!';
  }

  @Get()
  welcome(): string {
    return 'Welcome to my backend assessment page. List of routes:\n' +
      '- Sign In: /auth/signin\n' +
      '- Sign Up: /auth\n' +
      '- Update User: /user/:id\n' +
      '- Stripe Webhook: /stripe/webhook';
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
