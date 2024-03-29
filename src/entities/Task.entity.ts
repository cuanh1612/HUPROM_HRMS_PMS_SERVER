import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Employee } from "./Employee.entity";
import { Milestone } from "./Milestone.entity";
import { Project } from "./Project.entity";
import { Status } from "./Status.entity";
import { Task_Category } from "./Task_Category.entity";
import { Task_comment } from "./Task_Comment.entity";
import { Task_file } from "./Task_File.entity";
import { Time_log } from "./Time_Log.entity";



export enum enumPriority {
    LOW = 'Low',
    MEDIUM = 'Medium',
    HIGH = 'High'
}

@Entity()
export class Task extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column({ type: 'date' })
    start_date!: Date

    @Column({ type: 'date' })
    deadline: Date

    @Column()
    index: number

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

    @OneToMany(()=> Task_comment, (task_comment) => task_comment.task)
    task_comments: Task_comment[]
    
    @ManyToOne(()=> Milestone, (milestone) => milestone.tasks,{
        onDelete: 'SET NULL',
		nullable: true
    })
    @JoinColumn()
    milestone: Milestone

    @OneToMany(() => Task_file, (task_file) => task_file.task,{
        onDelete: 'SET NULL',
        nullable: true
    })
    task_files: Task_file[]

    @ManyToOne(() => Employee, (employee) => employee.tasksAssignBy, {
        onDelete: 'CASCADE',
        nullable: true,
    })
    @JoinColumn()
    assignBy: Employee

    @ManyToOne(() => Status, (status) => status.tasks, {
        onDelete: 'CASCADE',
        nullable: true,
    })
    @JoinColumn()
    status: Status

    @OneToMany(() => Time_log, (time_log) => time_log.task, {
		nullable: true,
	})
	time_logs: Time_log[]

    @CreateDateColumn({
		name: 'created_at',
        
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date

}

