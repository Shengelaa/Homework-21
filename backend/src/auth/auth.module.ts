import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { userSchema } from 'src/users/schema/user.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({ global: true, secret: process.env.JWT_SECRET }),
    MongooseModule.forFeature([{ schema: userSchema, name: 'user' }]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
