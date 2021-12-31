import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiResponse({
    description: 'hello',
  })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
