import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user-model";
import { Object } from "./object-model";

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  commentID: number;

  @ManyToOne(() => Object, (object) => object.comments)
  object: Object;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @Column()
  message: string;
}