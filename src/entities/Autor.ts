import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("authors")
class Autor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    length: 200,
    nullable: false,
  })
  name: string;

  @Column({ type: "timestamp" })
  birthdate: Date;

  @Column({ type: "varchar" })
  biography: string;

  @Column({
    type: "varchar",
    length: 50,
    nullable: false,
  })
  nationality: string;

  @Column({ type: "boolean" })
  active: boolean;

  @CreateDateColumn({ type: "timestamp", default: "now()" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp", onUpdate: "now()", nullable: true })
  updated_at: Date;
}

export default Autor;
