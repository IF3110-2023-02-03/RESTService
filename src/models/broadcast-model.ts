import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
  } from "typeorm";
  import { User } from "./user-model";
  import { Comment } from "./comment-model";
  import { Like } from "./like-model";
  
  @Entity()
  export class Broadcast extends BaseEntity {
    @PrimaryGeneratedColumn()
    objectID: number;
  
    @ManyToOne(() => User, (user) => user.bc)
    user: User;
  
    @Column()
    description: string;
  
    @Column({ type: "timestamp" })
    post_date: Date;
  
    @OneToMany(() => Comment, (comment) => comment.bc)
    comments: Comment[];
  
    @OneToMany(() => Like, (like) => like.bc)
    likes: Like[];
  }
  