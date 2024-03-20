import { Column, Entity, Generated, PrimaryColumn } from "typeorm";

@Entity({
    name: 'users'
})
export class User {
    @Generated("increment")
    @PrimaryColumn({ name: 'id', nullable: false, type: 'bigint' })
    id: number;

    @Column({
        name: 'email',
        nullable: false,
        type: 'varchar',
    })
    email: string;

    @Column({
        name: 'pass',
        nullable: false,
        type: 'varchar',
    })
    password: string;

    @Column({
        name: 'roles',
        nullable: false,
        type: 'varchar',
    })
    roles: string;

    rolesList: string[];
}

export function expandRoles(user: User) {
    if (user.roles) {
        user.rolesList = user.roles.split(',');
    } else {
        user.rolesList = [];
    }
}

export function compressRoles(user: User) {
    if (user.rolesList) {
        user.roles = user.rolesList.join(',');
    } else {
        user.roles = undefined;
    }
}