import { TenantProvider } from './tenancy.provider';
import {
  BadRequestException,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { Connection, createConnection, getConnection } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NextFunction, Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { TenancyController } from './tenancy.controller';
import { TenancyService } from './tenancy.service';
import { Tenancy } from './tenancy.entity';
import { User } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tenancy])],
  providers: [TenancyService, TenantProvider],
  controllers: [TenancyController],
  exports: [TenantProvider],
})
export class TenancyModule {
  constructor(
    private readonly connection: Connection,
    private readonly configService: ConfigService,
    private readonly tenancyService: TenancyService,
  ) {}

  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(async (req: Request, res: Response, next: NextFunction) => {
        const name: string = req.params['tenant'];
        const tenancy: Tenancy = await this.tenancyService.findOne(name);

        if (!tenancy) {
          throw new BadRequestException(
            'Database Connection Error',
            'This tenant does not exist',
          );
        }

        try {
          getConnection(tenancy.name);
          next();
        } catch (e) {
          await this.connection.query(
            `CREATE DATABASE IF NOT EXISTS ${tenancy.name}`,
          );

          const createdConnection: Connection = await createConnection({
            name: tenancy.name,
            type: 'mysql',
            host: this.configService.get('DB_HOST'),
            port: +this.configService.get('DB_PORT'),
            username: this.configService.get('DB_USER'),
            password: this.configService.get('DB_PASSWORD'),
            database: tenancy.name,
            entities: [User],
            ssl: true,
            synchronize:
              this.configService.get('NODE_ENV') === 'production'
                ? false
                : true,
          });

          if (createdConnection) {
            next();
          } else {
            throw new BadRequestException(
              'Database Connection Error',
              'There is an Error with the Database',
            );
          }
        }
      })
      .exclude({ path: '/api/tenants', method: RequestMethod.ALL })
      .forRoutes('*');
  }
}
