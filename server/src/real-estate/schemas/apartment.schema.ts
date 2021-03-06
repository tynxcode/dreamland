import { ApartmentType, Direction, Furniture, RealEstateCategory, RealEstateStatus } from "../enum/real-estate.enum"
import { Acreage, Address, Detail, Overview, Position, RealEstate } from "./parent-classes/general.schema"
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Project } from "src/project/schemas/project.schema";

export type ApartmentDocument = Apartment & Document;

@Schema({ _id: false, id: false })
class ApartmentPosition extends Position {
    @Prop()
    blockName?: string

    @Prop()
    floorNumber?: string
}

@Schema({ _id: false, id: false })
class ApartmentDetail extends Detail {
    @Prop(ApartmentPosition)
    position: ApartmentPosition

    @Prop(Address)
    address: Address

    @Prop(Acreage)
    acreage: Acreage
}

@Schema({ _id: false, id: false })
class ApartmentOverview extends Overview {
    @Prop({ enum: ApartmentType })
    type: ApartmentType

    @Prop({ enum: RealEstateStatus })
    status: RealEstateStatus

    @Prop({ enum: Direction })
    balconyDirection?: Direction

    @Prop()
    numberOfBedrooms: number

    @Prop()
    numberOfBathrooms?: number

    @Prop({ enum: Furniture })
    furniture?: Furniture
}

@Schema()
export class Apartment extends RealEstate {
    @Prop({ enum: RealEstateCategory })
    category: RealEstateCategory

    @Prop({ type: ApartmentDetail })
    detail: ApartmentDetail

    @Prop({ type: ApartmentOverview })
    overview: ApartmentOverview
}

const ApartmentSchema = SchemaFactory.createForClass(Apartment)
export { ApartmentSchema }
