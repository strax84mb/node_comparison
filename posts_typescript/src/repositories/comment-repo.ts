import { Comment } from "../entities/comment";
import { Bean } from "../context/context";
import { MySqlDataSource, idMySqlDataSource } from "./data-source";
import { Repository } from "typeorm";
import { PaginationInput } from "../util/types";

export const idCommentRepository: string = 'app-repositories-CommentRepository';

export class CommentRepository extends Bean {
    private  repo: Repository<Comment>;

    async __init() {
        const ds = await this.__ctx.getBean(idMySqlDataSource, MySqlDataSource) as MySqlDataSource;
        this.repo = ds.dataSource.getRepository(Comment);
    }

    find(input: PaginationInput): Promise<Comment[]> {
        return this.repo.find({
            take: input.limit,
            skip: input.offset,
        });
    }

    findById(id: number): Promise<Comment> {
        return this.repo.findOne({
            where: {
                id: id,
            }
        });
    }

    findByCityId(cityId: number): Promise<Comment[]> {
        return this.repo.find({
            where: {
                cityId: cityId,
            }
        });
    }

    async insert(comment: Comment) {
        comment.createdAt = new Date();
        comment.updatedAt = new Date();
        await this.repo.insert(comment);
    }

    async update(comment: Comment): Promise<number> {
        const result = await this.repo.createQueryBuilder()
            .update()
            .set({
                text: comment.text,
                updatedAt: new Date(),
            })
            .where('id = :id', { id: comment.id })
            .execute();
        return result.affected;
    }

    async deleteById(id: number): Promise<number> {
        const result = await this.repo.createQueryBuilder()
            .delete()
            .where('id = :id', { id: id })
            .execute();
        return result.affected;
    }

    async deleteByCityId(cityId: number) {
        const result = await this.repo.createQueryBuilder()
            .delete()
            .where('city_id = :id', { id: cityId })
            .execute();
        return result.affected;
    }
}