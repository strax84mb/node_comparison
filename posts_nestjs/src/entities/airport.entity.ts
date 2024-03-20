import { Column, Entity, Generated, PrimaryColumn } from "typeorm";

@Entity({ name: 'airports' })
export class Airport {
    @Generated('increment')
    @PrimaryColumn({
        name: 'id',
        nullable: false,
        type: 'bigint',
    })
    id: number;

    @Column({
        name: 'city_id',
        nullable: false,
        type: 'bigint',
    })
    cityId: number;

    @Column({
        name: 'name',
        nullable: false,
        type: 'varchar',
    })
    name: string;
}