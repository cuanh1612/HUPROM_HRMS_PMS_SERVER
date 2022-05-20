import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Project } from "./Project";
import { Task } from "./Task";


@Entity()
export class Status extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    title: String

    @Column()
    index: Number

    @ManyToOne(() => Project, (project) => project.status, {
        onDelete: 'CASCADE',
        nullable: true,
    })
    @JoinColumn()
    project: Project

    @Column({nullable: true})
    color: String

    @OneToMany(() => Task, (task) => task.status,{
        onDelete: 'SET NULL',
        nullable: true
    })
    tasks: Task

    @Column({default: false})
    root: Boolean





}