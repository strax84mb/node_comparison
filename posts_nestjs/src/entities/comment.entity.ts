import { Column, Entity, Generated, PrimaryColumn } from "typeorm";

@Entity({ name: 'comments' })
export class Comment {
    @Generated('increment')
    @PrimaryColumn({
        name: 'id',
        nullable: false,
        type: 'bigint',
    })
    id: number;

    @Column({
        name: 'user_id',
        nullable: false,
        type: 'bigint',
    })
    userId: number;

    @Column({
        name: 'city_id',
        nullable: false,
        type: 'bigint',
    })
    cityId;

    @Column({
        name: 'text',
        nullable: false,
        type: 'varchar',
    })
    text: string;

    @Column({
        name: 'updated_at',
        nullable: false,
        type: 'timestamp',
        default: 'current_timestamp',
    })
    updatedAt: Date;

    @Column({
        name: 'created_at',
        nullable: false,
        type: 'timestamp',
        default: 'current_timestamp',
    })
    createdAt: Date;
}