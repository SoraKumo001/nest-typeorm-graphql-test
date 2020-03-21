import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageResolver } from './message/message.resolver';
import { MessageModule } from './message/message.module';
import { Message } from './message/message';

@Module({
  imports: [
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: "schema.graphql",
    }),
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: `test.sqlite`,
      logging: true,
      synchronize: true,
      entities: [Message],
    }),
    MessageModule,
  ],
  providers: [MessageResolver],
})
export class AppModule {}
