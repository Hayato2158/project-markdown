// src/entities/Note.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Note {
  @PrimaryGeneratedColumn('uuid')
  uuid!: string

  @Column()
  title!: string

  @Column({ type: "text" })
  content!: string

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  lastEditTime!: Date
}
