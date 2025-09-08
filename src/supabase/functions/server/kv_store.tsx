// server/kv_store.js

import { createClient } from "@supabase/supabase-js"

// Cria cliente com variáveis de ambiente do Node.js
const client = () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variable");
  }
  return createClient(url, key);
}

// Set: salva um par chave-valor
export const set = async (key, value) => {
  const supabase = client()
  const { error } = await supabase
    .from("kv_store_d1d68d30")
    .upsert({ key, value })

  if (error) throw new Error(error.message)
}

// Get: busca um valor pela chave
export const get = async (key) => {
  const supabase = client()
  const { data, error } = await supabase
    .from("kv_store_d1d68d30")
    .select("value")
    .eq("key", key)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data?.value
}

// Delete: remove um item
export const del = async (key) => {
  const supabase = client()
  const { error } = await supabase
    .from("kv_store_d1d68d30")
    .delete()
    .eq("key", key)

  if (error) throw new Error(error.message)
}

// Mset: salva vários de uma vez
export const mset = async (keys, values) => {
  const supabase = client()
  const rows = keys.map((k, i) => ({ key: k, value: values[i] }))
  const { error } = await supabase
    .from("kv_store_d1d68d30")
    .upsert(rows)

  if (error) throw new Error(error.message)
}

// Mget: busca vários
export const mget = async (keys) => {
  const supabase = client()
  const { data, error } = await supabase
    .from("kv_store_d1d68d30")
    .select("value")
    .in("key", keys)

  if (error) throw new Error(error.message)
  return data?.map((d) => d.value) ?? []
}

// Mdel: deleta vários
export const mdel = async (keys) => {
  const supabase = client()
  const { error } = await supabase
    .from("kv_store_d1d68d30")
    .delete()
    .in("key", keys)

  if (error) throw new Error(error.message)
}

// Busca por prefixo
export const getByPrefix = async (prefix) => {
  const supabase = client()
  const { data, error } = await supabase
    .from("kv_store_d1d68d30")
    .select("key, value")
    .like("key", `${prefix}%`)

  if (error) throw new Error(error.message)
  return data?.map((d) => d.value) ?? []
}
