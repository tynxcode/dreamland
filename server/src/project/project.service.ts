import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project as ProjectModel, ProjectDocument } from './schemas/project.schema';
import { Model } from 'mongoose';
import { CreateProjectInput } from './dto/create.input';
import { Project } from './models/project.model';
import { ProjectFilter } from './dto/filter.input';
import { PaginationArgs } from 'src/real-estate/dto/inputs/general/paging.input';
import { nonAccentVietnamese } from './utils/vietnamese-accent';
import { UpdateStatusInput } from './dto/edit.input';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class ProjectService {
    constructor(
        @InjectModel(ProjectModel.name) private projectModel: Model<ProjectDocument>,
        private cloudinaryService: CloudinaryService
    ) { }

    async createProject(data: CreateProjectInput): Promise<Project> {
        try {
            const newPj = await this.projectModel.create({
                ...data,
                timeStamp: new Date(),
                directLink: nonAccentVietnamese(data.projectName + " " + data.address.province + " " + data.address.district).replace(/\s/g, "-")
            })

            return await newPj.save()
        } catch (error) {
            throw new BadRequestException({
                message: error
            })
        }
    }

    async editProject(projectId: string, updateData: CreateProjectInput | null, updateState: UpdateStatusInput | null): Promise<Project> {
        try {
            const updated = await this.projectModel.findByIdAndUpdate(projectId, {
                ...updateData,
                ...updateState
            })

            if (updateData) {
                updated.media.images.forEach(async (image) => {
                    const exist = updateData.media.images.find(img => img === image)
                    if (!exist) {
                        await this.cloudinaryService.removeFile(image)
                    }
                })

                updated.utilities.forEach(async (util) => {
                    const exist = updateData.utilities.find(updateUtil => updateUtil.image === util.image)
                    if (!exist) {
                        await this.cloudinaryService.removeFile(util.image)
                    }
                })

                updated.masterPlan.forEach(async (item) => {
                    const exist = updateData.masterPlan.find(updateItem => updateItem.image === item.image)
                    if (!exist) {
                        await this.cloudinaryService.removeFile(item.image)
                    }
                })
            }

            return updated
        } catch (error) {
            throw new BadRequestException(err => ({
                ...err,
                message: "Update failed !"
            }))
        }
    }

    async getProjectByDirectLink(link: string): Promise<Project> {
        try {
            return await this.projectModel.findOne({ directLink: link })
        } catch (error) {
            throw new NotFoundException()
        }
    }

    async getProjects(filter: ProjectFilter, paging: PaginationArgs): Promise<Project[]> {
        try {
            let query = {
                actived: true,
                ...(paging?.cursor && { index: { $gte: paging.cursor } }),
                ...(filter?.price?.max && { "information.purchaseInfo": { $gte: filter.price.min, $lte: filter.price.max } }),
                ...(filter?.address?.province && { "address.province": filter.address.province }),
                ...(filter?.address?.district && { "address.district": filter.address.district }),
                ...(filter?.address?.ward && { "address.ward": filter.address.ward }),
                ...(filter?.address?.province && { "address.province": filter.address.province }),
                ...(filter?.handOverYear && { "information.handOverYear": { $gte: filter.handOverYear } })
            }

            return await this.projectModel.find(query).limit(paging?.limit)
        } catch (error) {
            throw new NotFoundException(err => ({
                ...err,
                message: "Not found any projects !"
            }))
        }
    }

    async getAllProjects(): Promise<Project[]> {
        try {
            return await this.projectModel.find()
        } catch (error) {
            throw new NotFoundException(err => ({
                ...err,
                message: "Not found any projects !"
            }))
        }
    }

    async getOutstandingProjects(paging: PaginationArgs): Promise<Project[]> {
        try {
            return await this.projectModel.find({ actived: true, outstanding: true }).limit(paging?.limit).skip(paging?.cursor)
        } catch (error) {
            throw new NotFoundException()
        }
    }



    async projectStats() {
        try {
            return {
                projects: await this.projectModel.countDocuments({ actived: true })
            }
        } catch (error) {
            throw new NotFoundException()
        }
    }
}
