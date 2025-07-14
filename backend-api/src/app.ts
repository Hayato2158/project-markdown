import "reflect-metadata"
import express from "express"
import cors from "cors"
import { AppDataSource } from "../src/ormconfig"
import { Note } from "./entities/Note"

const app = express()
const PORT = 8000

app.use(cors())
app.use(express.json())

AppDataSource.initialize().then(() => {
  console.log("Database connected")

  // ノート一覧取得
  app.get("/notes", async (_req, res) => {
    const notes = await AppDataSource.getRepository(Note).find()
    res.json(notes)
  })

  // ノート新規作成
  app.post("/notes", async (req, res) => {
    const { title, content, lastEditTime } = req.body
    const note = new Note()
    note.title = title
    note.content = content
    note.lastEditTime = lastEditTime ? new Date(lastEditTime) : new Date()

    const result = await AppDataSource.getRepository(Note).save(note)
    res.json(result)
  })

  // ノート1件取得（uuid使用）
  app.get("/notes/:uuid", async (req, res) => {
    const note = await AppDataSource.getRepository(Note).findOneBy({ uuid: req.params.uuid })
    if (!note) return res.status(404).json({ message: "Not found" })
    res.json(note)
  })

  // ノート更新（uuid使用）
  app.put("/notes/:uuid", async (req, res) => {
    const { title, content, lastEditTime } = req.body
    const repo = AppDataSource.getRepository(Note)
    const note = await repo.findOneBy({ uuid: req.params.uuid })

    if (!note) return res.status(404).json({ message: "Note not found" })

    note.title = title
    note.content = content
    note.lastEditTime = new Date(lastEditTime)

    const updated = await repo.save(note)
    res.json(updated)
  })

  // ノート削除（uuid使用）
  app.delete("/notes/:uuid", async (req, res) => {
    const repo = AppDataSource.getRepository(Note)
    const note = await repo.findOneBy({ uuid: req.params.uuid })

    if (!note) return res.status(404).json({ message: "Note not found" })

    await repo.remove(note)
    res.json({ success: true })
  })

  app.listen(PORT, () => {
    console.log(`API server running at http://localhost:${PORT}`)
  })
})
