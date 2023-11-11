import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user-model";
import { Object } from "./object-model";

@Entity()
export class Like extends BaseEntity {
  @PrimaryGeneratedColumn()
  likeID: number;

  @ManyToOne(() => Object, (object) => object.likes)
  object: Object;

  @ManyToOne(() => User, (user) => user.likes)
  user: User;
}
