import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'
import { Client } from './Client'
import { Department } from './Department'
import { Employee } from './Employee'
import { Hourly_rate_project } from './Hourly_rate_project'
import { Milestone } from './Milestone'
import { Project_Activity } from './Project_Activity'
import { Project_Category } from './Project_Category'
import { Project_Discussion_Room } from './Project_Discussion_Room'
import { Project_file } from './Project_File'
import { Project_note } from './Project_Note'
import { Status } from './Status'
import { Task } from './Task'
import { Time_log } from './Time_Log'

export enum enumCurrency {
	USD = 'USD',
	GBP = 'GBP',
	EUR = 'EUR',
	INR = 'INR',
	VND = 'VND',
}

export enum enumProjectStatus {
	NOT_STARTED = "Not Started",
	IN_PROGRESS = "In Progress",
	ON_HOLD = "On Hold",
	CANCELED = "Canceled",
	FINISHED = "Finished"
}


@Entity()
export class Project extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number

	@Column({ unique: true })
	name!: string

	@Column({ type: 'date' })
	start_date!: Date

	@Column({ type: 'date' })
	deadline: Date

	@Column({ nullable: true })
	project_summary: string

	@Column({ nullable: true })
	notes: string

	@Column({ nullable: true })
	project_budget: number

	@Column({ nullable: true })
	hours_estimate: number

	@Column({ type: 'boolean', default: false })
	send_task_noti: boolean

	@ManyToOne(() => Project_Category, (project_Category) => project_Category.projects, {
		onDelete: 'SET NULL',
		nullable: true,

	})
	@JoinColumn()
	project_category: Project_Category

	@ManyToOne(() => Department, (department) => department.projects, {
		onDelete: 'SET NULL',
		nullable: true,

	})
	@JoinColumn()
	department: Department

	@ManyToOne(() => Client, (client) => client.projects, {
		onDelete: 'SET NULL',
		nullable: true,

	})
	@JoinColumn()
	client: Client

	@ManyToMany(() => Employee, { onDelete: 'CASCADE', eager: true })
	@JoinTable({ name: 'project_employee' })
	employees: Employee[]


	@Column({ type: 'enum', enum: enumCurrency, default: enumCurrency.USD })
	currency: string

	@Column({ default: 0 })
	Progress: number

	@ManyToOne(() => Employee, (Employee) => Employee.projects, {
		onDelete: 'SET NULL',

	})
	@JoinColumn()
	Added_by: Employee

	@OneToMany(() => Project_file, (project_file) => project_file.project, {
		onDelete: 'SET NULL',
		nullable: true,
	})
	project_files: Project_file[]

	@OneToMany(() => Project_Activity, (project_activities) => project_activities.project, {
		onDelete: 'SET NULL',
		nullable: true,
	})
	project_activities: Project_Activity[]

	@OneToMany(() => Time_log, (time_log) => time_log.project, {
		nullable: true,
	})
	time_logs: Time_log[]

	@OneToMany(() => Project_Discussion_Room, (project_Discussion_Room) => project_Discussion_Room.project, {
		onDelete: 'SET NULL',
		nullable: true,
	})
	project_discussion_rooms: Project_Discussion_Room[]

	@OneToMany(() => Status, (status) => status.project)
	status: Status

	@ManyToOne(()=> Employee, (employee)=> employee.projects_management)
	@JoinColumn()
	project_Admin: Employee

	@OneToMany(() => Task, (task) => task.project, {
		onDelete: "SET NULL"
	})
	tasks: Task[]

	@OneToMany(()=> Hourly_rate_project, hourly_rate_project=> hourly_rate_project.project)
	hourly_rate_projects: Hourly_rate_project[]

	@OneToMany(() => Milestone, (milestone) => milestone.project, {
		onDelete: 'SET NULL'
	})
	milestones: Milestone[]

	@OneToMany(() => Project_note, (project_notice) => project_notice.project, {
		onDelete: 'SET NULL',
	})
	project_notes: Project_note[]

	@OneToMany(() => Time_log, (timelog) => timelog.project, {
		onDelete: 'SET NULL',
		nullable: true,
	})
	timelogs: Time_log[]

	@Column({ type: 'enum', enum: enumProjectStatus, default: enumProjectStatus.NOT_STARTED })
	project_status: string

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date
}
