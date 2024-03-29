import { 
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn, } from "typeorm";
import { Employee } from "./Employee.entity";
import { Project } from "./Project.entity";

@Entity()
export class Hourly_rate_project extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @ManyToOne(()=> Employee, (employee)=> employee.hourly_rate_projects, {
        onDelete: "CASCADE"
    })
    @JoinColumn()
	employee: Employee

    @ManyToOne(()=> Project, (project)=> project.hourly_rate_projects, {
        onDelete: "CASCADE"
    })
    @JoinColumn()
	project: Project

    @Column('float', {
        nullable: true
    })
    hourly_rate: number

    @CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date

}

