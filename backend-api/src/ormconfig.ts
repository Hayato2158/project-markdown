import { DataSource } from "typeorm"
import { Note } from "../src/entities/Note"

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "notes.db",
  synchronize: true,
  entities: [Note],
})
