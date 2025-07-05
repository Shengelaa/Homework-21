import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schema/user.schema';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('user') private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}
  async signUp({
    name,
    lastname,
    email,
    gender,
    phoneNumber,
    password,
  }: SignUpDto) {
    const existUser = await this.userModel.findOne({ email });
    const subscriptionStartDate = new Date().toISOString();
    const subscriptionEndDate = new Date();
    subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);

    if (existUser) {
      throw new BadRequestException('user with that email already exists');
    }

    const hashedPass: string = await bcrypt.hash(password, 10);
    const role = 'user';
    const newUser = await this.userModel.create({
      name,
      lastname,
      email,
      gender,
      phoneNumber,
      password: hashedPass,
      role,
      subscriptionStartDate,
      subscriptionEndDate: subscriptionEndDate.toISOString(),
    });

    return {
      message: 'created successfully',
      data: {
        _id: newUser._id,
        name,
        lastname,
        email,
      },
    };
  }

  async signIn({ email, password }: SignInDto) {
    const existUser = await this.userModel
      .findOne({ email })
      .select('password');

    if (!existUser) {
      throw new NotFoundException('Email Or Password is incorrect');
    }

    const isPassEqual = await bcrypt.compare(password, existUser.password);

    if (!isPassEqual) {
      throw new NotFoundException('Email Or Password is incorrect!');
    }

    const payload = {
      id: existUser._id,
    };

    const token = this.jwtService.sign(payload, { expiresIn: '1h' });

    return { token };
  }

  async getCurrentUser(userId) {
    const user = await this.userModel.findById(userId);

    return user;
  }
}
