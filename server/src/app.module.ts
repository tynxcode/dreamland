import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RealEstateModule } from './real-estate/real-estate.module';
import { UserModule } from './user/user.module';
import { ProjectModule } from './project/project.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MongooseModule } from '@nestjs/mongoose';
import { StatsModule } from './stats/stats.module';
import { BlogModule } from './blog/blog.module';
import { PageTemplateModule } from './page-template/page-template.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import type { ClientOpts } from 'redis';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register<ClientOpts>({
      isGlobal: true,
      // store: redisStore,

      // // Store-specific configuration:
      // host: process.env.REDIS_HOST,
      // port: 6379,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: false,
      autoSchemaFile: true
    }),
    MongooseModule.forRoot(process.env.ATLAS_URL, {
      connectionFactory: (connection) => {
        connection.plugin(require('mongoose-autopopulate'));
        return connection;
      }
    }
    ),
    RealEstateModule,
    UserModule,
    ProjectModule,
    StatsModule,
    BlogModule,
    PageTemplateModule,
    AuthModule,
    CloudinaryModule,
    TransactionModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
