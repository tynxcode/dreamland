import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { RealEstateType } from "src/real-estate/enum/real-estate.enum";
import { Profile } from "src/user/models/user.model";
import { TransactionStatus } from "../enums/transaction.enum";

registerEnumType(TransactionStatus, {
    name: 'TransactionStatus'
})

@ObjectType()
class TranSactionItem {
    @Field()
    itemId: string

    @Field(type => RealEstateType)
    itemType: RealEstateType
}

@ObjectType()
export class Transaction {
    @Field()
    _id?: string

    @Field(type => TranSactionItem)
    item: TranSactionItem

    @Field(type => TransactionStatus)
    status: TransactionStatus

    @Field(type => Profile)
    user: Profile

    @Field()
    createdAt: Date
}