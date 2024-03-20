import { Column, Entity, Generated, PrimaryColumn } from "typeorm";
import { Airport } from "./airport.entity";
import { Comment } from './comment.entity';

@Entity({
    name: 'cities'
})
export class City {
    @Generated("increment")
    @PrimaryColumn({ name: 'id', nullable: false, type: 'bigint' })
    id: number;

    @Column({ name: 'name', nullable: false, type: "varchar" })
    name: string;

    airports?: Airport[];

    comments?: Comment[];
}