import { supabase } from "./client";
import type { Database, Tables, TablesInsert, TablesUpdate } from "./types";

export type AdminTableName = keyof Database["public"]["Tables"];

type TableRecord<TTable extends AdminTableName> = Tables<TTable>;
type TableInsert<TTable extends AdminTableName> = TablesInsert<TTable>;
type TableUpdate<TTable extends AdminTableName> = TablesUpdate<TTable>;

export async function fetchTableRows<TTable extends AdminTableName>(
  table: TTable,
  options?: { order?: { column: string; ascending?: boolean } },
) {
  let query = supabase.from(table).select("*");

  if (options?.order) {
    query = query.order(options.order.column, { ascending: options.order.ascending ?? true });
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data as TableRecord<TTable>[];
}

export async function fetchTableCount(table: AdminTableName) {
  const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });

  if (error) {
    throw error;
  }

  return count ?? 0;
}

export async function fetchTableRow<TTable extends AdminTableName>(table: TTable, id: string) {
  const { data, error } = await supabase.from(table).select("*").eq("id", id).maybeSingle();

  if (error) {
    throw error;
  }

  return data as TableRecord<TTable> | null;
}

export async function insertTableRow<TTable extends AdminTableName>(
  table: TTable,
  values: TableInsert<TTable>,
) {
  const { data, error } = await supabase.from(table).insert(values).select().maybeSingle();

  if (error) {
    throw error;
  }

  return data as TableRecord<TTable>;
}

export async function updateTableRow<TTable extends AdminTableName>(
  table: TTable,
  id: string,
  values: TableUpdate<TTable>,
) {
  const { data, error } = await supabase.from(table).update(values).eq("id", id).select().maybeSingle();

  if (error) {
    throw error;
  }

  return data as TableRecord<TTable>;
}

export async function deleteTableRow(table: AdminTableName, id: string) {
  const { error } = await supabase.from(table).delete().eq("id", id);

  if (error) {
    throw error;
  }
}
