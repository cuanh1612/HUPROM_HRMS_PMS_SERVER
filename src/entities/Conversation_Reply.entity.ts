import {
    BaseEntity, Column, CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne, PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm'
import { Conversation } from './Conversation.entity'
import { Employee } from './Employee.entity'

@Entity()
export class  Conversation_reply extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number

    @ManyToOne(() => Employee, (employee) => employee.conversation_replies, {
		onDelete: 'CASCADE',
		eager: true,
		nullable: true,
	})
	@JoinColumn()
	user: Employee

	@ManyToOne(() => Conversation, (conversation) => conversation.conversation_replies, {
		onDelete: 'CASCADE',
		eager: true,
		nullable: true,
	})
	@JoinColumn()
	conversation: Conversation

    @Column()
    reply: string

	@Column({nullable: true, default: false})
	read: boolean

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date
}
