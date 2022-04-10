import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { Employee } from './Employee'

@Entity()
export class Attendance extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number

	@Column()
	working_from!: string

	@Column()
	clock_in_time!: string

	@Column()
	clock_out_time!: string
    
	@Column({ type: 'date' })
	date!: Date

	@Column('boolean', { default: false })
	late: boolean

	@Column('boolean', { default: false })
	half_day: boolean

	@ManyToOne(() => Employee, (employee) => employee.attendances, {
		onDelete: 'CASCADE',
		eager: true,
	})
	@JoinColumn()
	employee: Employee

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date
}