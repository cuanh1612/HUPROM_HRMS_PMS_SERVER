import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Employee } from "./Employee";
import { Project } from "./Project";
import { Status } from "./Status";
import { Task_Category } from "./Task_Category";
import { Task_file } from "./Task_File";



export enum enumPriority {
    LOW = 'Low',
    MEDIUM = 'Medium',
    HIGH = 'High'
}

@Entity()
export class Task extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({unique: true})
    name!: string

    @Column({ type: 'date' })
    start_date!: Date

    @Column({ type: 'date' })
    deadline: Date

    @Column()
    index: Number

    @ManyToOne(() => Task_Category, (task_Category) => task_Category.tasks, {
        onDelete: 'SET NULL',
        nullable: true
    })
    @JoinColumn()
    task_category: Task_Category

    @ManyToOne(() => Project, (project)=> project.tasks,{
        onDelete: "CASCADE",
    })
    @JoinColumn()
    project: Project

    @ManyToMany(() => Employee, {onDelete: 'CASCADE'})
	@JoinTable({ name: 'task_employee'})
	employees: Employee[]

    @Column({ nullable: true})
    description: string


    @Column({type: 'enum', enum: enumPriority, default: enumPriority.LOW})
    priority: string

    @ManyToOne(() => Task, (task)=> task.tasks,{
        onDelete: "SET NULL"
    })
    @JoinColumn()
    task: Task

    @OneToMany(()=> Task, (task) => task.task)
    tasks: Task[]

    @OneToMany(() => Task_file, (task_file) => task_file.task,{
        onDelete: 'SET NULL',
        nullable: true
    })
    task_files: Task_file[]

    @ManyToOne(() => Status, (status) => status.tasks, {
        onDelete: 'CASCADE',
        nullable: true,
    })
    @JoinColumn()
    status: Status

    @CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date

}
