import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { Project } from './Project.entity'
import { Task } from './Task.entity'

@Entity()
export class Milestone extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number

	@Column({ unique: true })
	title: string

	@Column('float', { nullable: true })
	cost: number

	@Column({ default: false })
	addtobudget: boolean

	@Column({ default: false })
	status: boolean

	@Column({ nullable: true })
	summary: string

	@ManyToOne(() => Project, (project) => project.milestones, {
		nullable: true,
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	project: Project

	@OneToMany(() => Task, (task) => task.milestone, {
		nullable: true,
		onDelete: 'CASCADE',
	})
	tasks: Task[]

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date
}
