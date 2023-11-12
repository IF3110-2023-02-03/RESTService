import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Objects } from "./object-model";
import { Comment } from "./comment-model";
import { Like } from "./like-model";
import { Broadcast } from "./broadcast-model";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  userID: number;

  @Column()
  fullname: string;

  @Column({
    unique: true,
  })
  username: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  pp_url: string;

  @OneToMany(() => Objects, (object) => object.user)
  objects: Objects[];

  @OneToMany(() => Broadcast, (bc) => bc.user)
  bc: Objects[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];
}