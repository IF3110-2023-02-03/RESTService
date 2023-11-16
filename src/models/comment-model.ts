import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Objects } from "./object-model";
import { Broadcast } from "./broadcast-model";

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  commentID: number;

  @Column({
    type: "enum",
    enum: ["Broadcast", "Objects"],
  })
  type: string;

  @ManyToOne(() => Objects, (object) => object.comments)
  object: Objects;

  @ManyToOne(() => Broadcast, (bc) => bc.comments)
  bc: Broadcast;

  @Column()
  user: string;

  @Column()
  message: string;
}