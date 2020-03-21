import { Message, Messages } from "./message";

import {
  Query,
  Mutation,
  ID,
  Resolver,
  Int,
  Args,
  Info
} from "@nestjs/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GraphQLResolveInfo, FieldNode } from "graphql";

interface GraphQLFeald {
  [key: string]: GraphQLFeald | true;
}
const getFields = (info: GraphQLResolveInfo) => {
  const createFields = (nodes: FieldNode[]) => {
    const fealds: GraphQLFeald = {};
    nodes.forEach(n => {
      fealds[n.name.value] =
        (n.selectionSet &&
          createFields(n.selectionSet.selections as FieldNode[])) ||
        true;
    });
    return fealds;
  };
  return createFields(
    info.fieldNodes[0].selectionSet.selections as FieldNode[]
  );
};

@Resolver("Message")
export class MessageResolver {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>
  ) {}

  @Query(_ => Messages, { nullable: true })
  async messages(
    @Args({
      name: "first",
      type: () => Int,
      nullable: true
    })
    first?: number,
    @Args({ name: "last", type: () => Int, nullable: true })
    last?: number,
    @Args({ name: "page", type: () => Int, nullable: true })
    page?: number,
    @Info() info?
  ) {
    const fields = getFields(info);
    console.log(fields)
    const messageRep = this.messageRepository;

    const count = fields.count
      ? await messageRep.createQueryBuilder().getCount()
      : 0;

    const nodes = fields.nodes
      ? await messageRep.find({
          select: Object.keys(fields.nodes) as (keyof Message)[],
          order: {
            id: last ? "DESC" : "ASC"
          },
          take: first || last,
          skip: (first || last) * page
        })
      : [];
    return { count, nodes };
  }

  @Mutation(_ => ID)
  async addMessage(
    @Args("name") name: string,
    @Args("value") value: string
  ): Promise<number> {
    const messageRep = this.messageRepository;
    const message = messageRep.create({ name, value });
    await messageRep.save(message);
    return message.id;
  }
}
