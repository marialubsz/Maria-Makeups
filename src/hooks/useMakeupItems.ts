import { useState, useEffect } from "react"
import { MakeupItem } from "../types/makeup"

const STORAGE_KEY = "makeup-items"
// Agora aponta para o servidor Node/Express
const API_BASE = "http://maria=makeups.vercel.app"

export function useMakeupItems() {
  const [items, setItems] = useState<MakeupItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Helper para chamadas à API
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Network error" }))
      throw new Error(errorData.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // 🔹 Carregar itens do servidor
  const loadItems = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await apiCall("/makeup-items")

      if (response.success) {
        const migratedItems = response.data.map((item: any) => ({
          ...item,
          acquisitionPrice: item.acquisitionPrice ?? item.price ?? 0,
          wasGift: item.wasGift ?? false,
        }))
        setItems(migratedItems)
      }
    } catch (error) {
      console.error("Erro ao carregar itens do servidor:", error)
      setError(`Erro ao carregar itens: ${error}`)
      // fallback
      await loadFromLocalStorage()
    } finally {
      setIsLoading(false)
    }
  }

  // 🔹 Carregar itens do localStorage se servidor falhar
  const loadFromLocalStorage = async () => {
    const savedItems = localStorage.getItem(STORAGE_KEY)
    if (savedItems) {
      try {
        const parsedItems = JSON.parse(savedItems)
        const migratedItems = parsedItems.map((item: any) => ({
          ...item,
          acquisitionPrice: item.acquisitionPrice ?? item.price ?? 0,
          wasGift: item.wasGift ?? false,
        }))
        setItems(migratedItems)
        // tentar migrar
        await migrateToServer(migratedItems)
      } catch (error) {
        console.error("Erro ao carregar do localStorage:", error)
        setItems([])
      }
    }
  }

  // 🔹 Migração do localStorage para o servidor
  const migrateToServer = async (localItems: MakeupItem[]) => {
    if (localItems.length === 0) return

    try {
      console.log(`Migrando ${localItems.length} itens para o servidor...`)
      await apiCall("/makeup-items/bulk", {
        method: "POST",
        body: JSON.stringify({ items: localItems }),
      })
      localStorage.removeItem(STORAGE_KEY)
      console.log("Migração concluída com sucesso!")
    } catch (error) {
      console.error("Erro na migração:", error)
    }
  }

  useEffect(() => {
    loadItems()
  }, [])

  // 🔹 Adicionar item
  const addItem = async (item: Omit<MakeupItem, "id">) => {
    try {
      setError(null)
      const response = await apiCall("/makeup-items", {
        method: "POST",
        body: JSON.stringify(item),
      })

      if (response.success) {
        setItems((prev) => [...prev, response.data])
      }
    } catch (error) {
      console.error("Erro ao adicionar item:", error)
      setError(`Erro ao adicionar item: ${error}`)
      // fallback
      const newItem: MakeupItem = { ...item, id: Date.now().toString() }
      setItems((prev) => [...prev, newItem])
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...items, newItem]))
    }
  }

  // 🔹 Atualizar item
  const updateItem = async (id: string, updatedItem: Omit<MakeupItem, "id">) => {
    try {
      setError(null)
      const response = await apiCall(`/makeup-items/${id}`, {
        method: "PUT",
        body: JSON.stringify(updatedItem),
      })

      if (response.success) {
        setItems((prev) =>
          prev.map((item) => (item.id === id ? response.data : item))
        )
      }
    } catch (error) {
      console.error("Erro ao atualizar item:", error)
      setError(`Erro ao atualizar item: ${error}`)
      // fallback
      const newItems = items.map((item) =>
        item.id === id ? { ...updatedItem, id } : item
      )
      setItems(newItems)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems))
    }
  }

  // 🔹 Deletar item
  const deleteItem = async (id: string) => {
    try {
      setError(null)
      await apiCall(`/makeup-items/${id}`, { method: "DELETE" })
      setItems((prev) => prev.filter((item) => item.id !== id))
    } catch (error) {
      console.error("Erro ao deletar item:", error)
      setError(`Erro ao deletar item: ${error}`)
      // fallback
      const newItems = items.filter((item) => item.id !== id)
      setItems(newItems)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems))
    }
  }

  return {
    items,
    isLoading,
    error,
    addItem,
    updateItem,
    deleteItem,
    refreshItems: loadItems,
  }
}
