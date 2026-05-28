import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import type { Conversation } from '../types/database';

const DB_KEY = 'audievit_v2_db';

let db: SqlJsDatabase | null = null;

export function getFirstWords(text: string, count: number): string {
  return text.split(/\s+/).slice(0, count).join(' ');
}

async function loadWasm(): Promise<SqlJsDatabase> {
  const SQL = await initSqlJs({
    locateFile: () => '/sql-wasm.wasm',
  });

  const saved = localStorage.getItem(DB_KEY);
  if (saved) {
    const binaryStr = atob(saved);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    return new SQL.Database(bytes);
  }

  const database = new SQL.Database();
  database.run(`
    CREATE TABLE IF NOT EXISTS conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orario TEXT NOT NULL,
      domanda TEXT NOT NULL,
      risposta_prima_parte TEXT
    )
  `);
  persist(database);
  return database;
}

function persist(database: SqlJsDatabase) {
  const data = database.export();
  const binary = String.fromCharCode(...new Uint8Array(data));
  localStorage.setItem(DB_KEY, btoa(binary));
}

export async function initDatabase(): Promise<void> {
  db = await loadWasm();
}

export function addConversation(domanda: string): number {
  if (!db) throw new Error('Database not initialized');
  const orario = new Date().toISOString();
  db.run(
    'INSERT INTO conversations (orario, domanda) VALUES (?, ?)',
    [orario, domanda],
  );
  persist(db);
  const result = db.exec('SELECT last_insert_rowid()');
  return result[0].values[0][0] as number;
}

export function updateRisposta(id: number, risposta: string): void {
  if (!db) throw new Error('Database not initialized');
  const parte = getFirstWords(risposta, 3);
  db.run('UPDATE conversations SET risposta_prima_parte = ? WHERE id = ?', [parte, id]);
  persist(db);
}

export function getConversations(): Conversation[] {
  if (!db) return [];
  const result = db.exec(
    'SELECT id, orario, domanda, risposta_prima_parte FROM conversations ORDER BY id DESC',
  );
  if (result.length === 0) return [];
  return result[0].values.map((row: unknown[]) => ({
    id: row[0] as number,
    orario: row[1] as string,
    domanda: row[2] as string,
    risposta_prima_parte: row[3] as string | null,
  }));
}

export function clearDatabase(): void {
  if (!db) return;
  db.run('DELETE FROM conversations');
  persist(db);
}
