import { Field, Float, Int, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Address } from "src/real-estate/models/parent-models/general";
import { ProjectType } from "../enum/pj.enum";

registerEnumType(ProjectType, {
    name: "ProjectType"
})

@ObjectType()
class ProjectUtilities {
    @Field(type => String)
    image: string

    @Field()
    title: string
}

@ObjectType()
class ProjectInformation {
    @Field(type => Float, { nullable: true })
    purchaseInfo?: number

    @Field(type => Float, { nullable: true })
    rentInfo?: number

    @Field(type => String, { nullable: true })
    startedAt?: string

    @Field(type => Number, { nullable: true })
    handOverYear?: number
    
    @Field(type => ProjectType)
    type: ProjectType

    @Field(type => Float, { nullable: true })
    acreage?: number

    @Field(type => String, { nullable: true })
    scale?: string

    @Field(type => String, { nullable: true })
    progressStatus?: string

    @Field(type => String, { nullable: true })
    status?: string
}

@ObjectType()
class ProjectMedia {
    @Field(type => [String])
    images: string[]
}

@ObjectType()
class ProjectInvestor {
    @Field()
    name: string

    @Field(type => Int, { nullable: true })
    establishYear: number

    @Field({ nullable: true })
    about: string
}

@ObjectType()
class MasterPlan {
    @Field()
    image: string
    
    @Field()
    title: string
}

@ObjectType()
export class Project {
    @Field(type => String)
    _id?: string

    @Field(type => ProjectMedia)
    media: ProjectMedia

    @Field(type => String)
    projectName: string

    @Field(type => Address)
    address: Address

    @Field(type => ProjectInformation)
    information: ProjectInformation

    @Field(type => [ProjectUtilities])
    utilities: ProjectUtilities[]

    @Field(type => String)
    description: string

    @Field(type => ProjectInvestor)
    investor: ProjectInvestor

    @Field(type => [MasterPlan])
    masterPlan: MasterPlan[]

    @Field(type => String)
    directLink: string

    @Field(type => String, { nullable: true })
    googleMapsLink?: string

    @Field(type => String, { nullable: true })
    virtual3DLink?: string

    @Field(type => Boolean)
    outstanding: boolean
    
    @Field(type => Date)
    timeStamp: Date

    @Field(type => Boolean)
    actived: boolean

    @Field(type => Int)
    index: number
}