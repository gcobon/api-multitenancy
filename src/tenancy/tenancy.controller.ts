import { Body, Controller, Get, Post } from '@nestjs/common';
import { TenancyService } from './tenancy.service';
import { ReadTenancyDto, CreateTenancyDto } from './dto';

@Controller('tenants')
export class TenancyController {
  constructor(private readonly tenantService: TenancyService) {}

  @Get()
  findAll(): Promise<ReadTenancyDto[]> {
    return this.tenantService.findAll();
  }

  @Post()
  create(@Body() tenant: CreateTenancyDto): Promise<ReadTenancyDto> {
    return this.tenantService.create(tenant);
  }
}
