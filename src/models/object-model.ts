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
export class Object extends BaseEntity {
  @PrimaryGeneratedColumn()
  objectID: number;

  @ManyToOne(() => User, (user) => user.objects)
  user: User;

  @Column()
  title: string;

  @Column({
    type: "enum",
    enum: ["Photo", "Video"],
  })
  type: string;

  @Column({ nullable: true })
  url_photo: string;

  @Column({ nullable: true })
  url_video: string;

  @Column()
  isPublic: boolean;

  @Column("date")
  date: string;

  @Column()
  location: string;

  @Column()
  description: string;

  @Column({ type: "datetime" })
  post_date: string;

  @Column()
  size: bigint;

  @OneToMany(() => Comment, (comment) => comment.object)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.object)
  likes: Like[];
}
