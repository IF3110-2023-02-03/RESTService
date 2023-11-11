import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Object } from "./object-model";
import { Comment } from "./comment-model";
import { Like } from "./like-model";

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

  @Column({
    default: false,
  })
  isAdmin: boolean;

  @Column()
  storage: bigint;

  @Column()
  storage_left: bigint;

  @OneToMany(() => Object, (object) => object.user)
  objects: Object[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];
}