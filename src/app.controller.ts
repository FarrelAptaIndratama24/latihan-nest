import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { CreateMahasiswaDTO } from './dto/create-mahasiswa.dto';
import { RegisterUserDTO } from './dto/register-user-dto';
//import { LoginDTO } from './dto/login.user.dto';
import { plainToInstance } from 'class-transformer';
import { Response } from 'express';
import { User } from './entity/user.entity';
import { UserDecorator } from './user.decorator';
import { AuthGuard } from './auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/auth')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  auth(@UserDecorator() user: User) {
    return user;
  }

  @Post('register')
  @ApiBody({ type: RegisterUserDTO })
  register(@Body() user: RegisterUserDTO) {
    return this.appService.register(user);
  }
  @Post('login')
  async login(
    @Body() data: RegisterUserDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.appService.login(data);

    res.cookie('token', result.token);

    result.user = plainToInstance(User, result.user);

    return result;
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('mahasiswa')
  getMahasiswa() {
    return this.appService.getMahasiswa();
  }

  @Get('mahasiswa/:nim')
  getMahasiswaByNim(@Param('nim') nim: string) {
    return this.appService.getMahasiswByNim(nim);
  }

  @Post('mahasiswa')
  @ApiBody({ type: CreateMahasiswaDTO })
  createMahasiswa(@Body() data: CreateMahasiswaDTO) {
    return this.appService.addMahasiswa(data);
  }
  @Put('mahasiswa/:nim')
  @ApiBody({ type: CreateMahasiswaDTO })
  updateMahasiswa(@Param('nim') nim: string, @Body() data: CreateMahasiswaDTO) {
    return this.appService.updateMahasiswa(nim, data);
  }
  @Delete('mahasiswa/:nim')
  deleteMahasiswa(@Param('nim') nim: string) {
    return this.appService.menghapusMahasiswa(nim);
  }
}
