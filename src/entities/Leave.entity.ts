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
import { Employee } from './Employee.entity'
import { Leave_type } from './Leave_Type.entity'

export enum enumStatus {
	APPROVED = 'Approved',
	PENDING = 'Pending',
	REJECTED = 'Rejected',
}

export enum enumDuration {
	SINGLE = 'Single',
	HALF_DAY = 'Half Day',
}

@Entity()
export class Leave extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number

	@ManyToOne(() => Employee, (employee) => employee.leaves, {
		onDelete: 'CASCADE',
		nullable: false,
		eager: true,
	})
	@JoinColumn()
	employee!: Employee

	@Column({ type: 'enum', enum: enumStatus, default: enumStatus.PENDING })
	status!: string

	@Column({ type: 'enum', enum: enumDuration, default: enumDuration.SINGLE })
	duration!: string

	@Column({ type: 'date' })
	date!: Date

	@ManyToOne(() => Leave_type, (Leave_type) => Leave_type.leaves, {
		nullable: false,
		eager: true,
	})
	@JoinColumn()
	leave_type!: Leave_type

	@Column()
	reason!: string

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date
}
