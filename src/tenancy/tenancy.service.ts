import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateTenancyDto } from './dto/create-tenancy.dto';
import { Tenancy } from './tenancy.entity';
import { ReadTenancyDto } from './dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TenancyService {
  constructor(
    @InjectRepository(Tenancy)
    private tenancyRepository: Repository<Tenancy>,
  ) {}

  async findAll(): Promise<ReadTenancyDto[]> {
    const tenants = await this.tenancyRepository.find();

    return tenants.map((tenant) => plainToClass(ReadTenancyDto, tenant));
  }

  async findOne(name: string): Promise<ReadTenancyDto> {
    return await this.tenancyRepository.findOne({ name });
  }

  async create(tenant: CreateTenancyDto): Promise<ReadTenancyDto> {
    const createdTenant = await this.tenancyRepository.save(tenant);

    return plainToClass(ReadTenancyDto, createdTenant);
  }
}
