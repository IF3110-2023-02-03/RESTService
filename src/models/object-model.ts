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
export class Objects extends BaseEntity {
  @PrimaryGeneratedColumn()
  objectID: number;

  @ManyToOne(() => User, (user) => user.objects)
  user: User;

  @Column()
  description: string;

  @Column({
    type: "enum",
    enum: ["Photo", "Video"],
  })
  type: string;

  @Column({ nullable: true })
  url: string;

  @Column("date")
  date: string;

  @Column({ type: "timestamp" })
  post_date: Date;

  @OneToMany(() => Comment, (comment) => comment.object)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.object)
  likes: Like[];
}
