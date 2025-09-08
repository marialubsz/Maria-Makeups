// server/server.js
import express from "express"
import cors from "cors"
import morgan from "morgan"
import { createClient } from "@supabase/supabase-js"

const app = express()
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())

// Config do Supabase
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables")
}

const supabase = createClient(
  supabaseUrl,
  supabaseServiceRoleKey
)

// 🔧 Simulação do kv_store (em memória, você pode trocar por Redis ou Supabase)
const kv = {
  store: new Map(),
  async getByPrefix(prefix) {
    return Array.from(this.store.values()).filter((item) => {
      if (typeof item === "object" && item !== null && "id" in item && typeof (item as any).id === "string") {
        return (item as any).id.startsWith(prefix.replace("makeup_item:", ""));
      }
      return false;
    })
  },
  async set(key, value) {
    this.store.set(key, value)
  },
  async del(key) {
    this.store.delete(key)
  },
}

// Endpoints
app.get("/make-server-d1d68d30/makeup-items", async (req, res) => {
  try {
    const items = Array.from(kv.store.values())
    console.log(`Retrieved ${items.length} makeup items`)
    res.json({ success: true, data: items })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, error: "Failed to fetch items" })
  }
})

app.post("/make-server-d1d68d30/makeup-items", async (req, res) => {
  try {
    const item = req.body
    const itemId = item.id || Date.now().toString()
    const itemWithId = { ...item, id: itemId }

    await kv.set(`makeup_item:${itemId}`, itemWithId)
    console.log(`Created makeup item: ${itemId}`)
    res.json({ success: true, data: itemWithId })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, error: "Failed to create item" })
  }
})

app.put("/make-server-d1d68d30/makeup-items/:id", async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body
    const updatedItem = { ...updates, id }

    await kv.set(`makeup_item:${id}`, updatedItem)
    console.log(`Updated makeup item: ${id}`)
    res.json({ success: true, data: updatedItem })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, error: "Failed to update item" })
  }
})

app.delete("/make-server-d1d68d30/makeup-items/:id", async (req, res) => {
  try {
    const { id } = req.params
    await kv.del(`makeup_item:${id}`)
    console.log(`Deleted makeup item: ${id}`)
    res.json({ success: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, error: "Failed to delete item" })
  }
})

app.post("/make-server-d1d68d30/makeup-items/bulk", async (req, res) => {
  try {
    const { items } = req.body
    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, error: "Items must be an array" })
    }

    const promises = items.map((item) => {
      const itemId =
        item.id ||
        Date.now().toString() + Math.random().toString(36).substr(2, 9)
      const itemWithId = { ...item, id: itemId }
      return kv.set(`makeup_item:${itemId}`, itemWithId)
    })

    await Promise.all(promises)
    console.log(`Bulk created ${items.length} makeup items`)
    res.json({ success: true, count: items.length })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, error: "Failed to bulk create items" })
  }
})

// Iniciar servidor
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
