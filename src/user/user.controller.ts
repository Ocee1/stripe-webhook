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
  Header,
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

  @Get('*')
  @Header('Content-Type', 'text/html') // Set the response header to indicate HTML content
  welcome(): string {
    return `
    <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome Page</title>
        <style>
          body {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
          }
          .container {
            text-align: center;
          }
          ul {
            list-style: none;
            padding: 0;
          }
          li {
            margin-bottom: 8px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Ochapa's backend API assessment. <br>List of routes:</h1>
          <ul>
            <li>Sign Up: /user/signup</li>
            <li>Sign In: /user/signin</li>            
            <li>Update User: /:id</li>
            <li>Stripe Webhook: /stripe/webhook</li>
          </ul>
        </div>
      </body>
      </html>
    `;
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
