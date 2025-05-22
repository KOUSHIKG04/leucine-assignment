import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    username!: string;

    @Column({ unique: true, nullable: true })
    email?: string;

    @Column()
    password!: string;

    @Column()
    role!: 'Employee' | 'Manager' | 'Admin';

    @CreateDateColumn()
    createdAt!: Date;
}