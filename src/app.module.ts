import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
// import { JwtService } from '@nestjs/jwt';
import { UserService } from './user/user.service';
import { AuthModule } from './auth/auth.module';
import { StripeModule } from './stripe/stripe.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserController } from './user/user.controller';
import { StripeService } from './stripe/stripe.service';
import { StripeController } from './stripe/stripe.controller';

@Module({
  imports: [
    UserModule,
    AuthModule,
    StripeModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'), 
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UserController, StripeController],
  providers: [UserService, StripeService],
})
export class AppModule {}
