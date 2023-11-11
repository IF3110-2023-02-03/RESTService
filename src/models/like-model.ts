import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user-model";
import { Objects } from "./object-model";
import { Broadcast } from "./broadcast-model";

@Entity()
export class Like extends BaseEntity {
  @PrimaryGeneratedColumn()
  likeID: number;

  @Column({
    type: "enum",
    enum: ["Broadcast", "Objects"],
  })
  type: string;

  @ManyToOne(() => Objects, (object) => object.likes)
  object: Objects;

  @ManyToOne(() => Broadcast, (bc) => bc.likes)
  bc: Broadcast;

  @ManyToOne(() => User, (user) => user.likes)
  user: User;
}
