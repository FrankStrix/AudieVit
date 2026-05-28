import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import type { Conversation } from '../types/database';

const DB_KEY = 'audievit_db';

let db: SqlJsDatabase | null = null;

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
      user_name TEXT NOT NULL,
      question TEXT NOT NULL,
      answer TEXT,
      created_at TEXT NOT NULL
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

export function addConversation(
  userName: string,
  question: string,
  answer: string | null,
): number {
  if (!db) throw new Error('Database not initialized');
  const createdAt = new Date().toISOString();
  db.run(
    'INSERT INTO conversations (user_name, question, answer, created_at) VALUES (?, ?, ?, ?)',
    [userName, question, answer, createdAt],
  );
  persist(db);
  const result = db.exec('SELECT last_insert_rowid()');
  return result[0].values[0][0] as number;
}

export function updateAnswer(id: number, answer: string): void {
  if (!db) throw new Error('Database not initialized');
  db.run('UPDATE conversations SET answer = ? WHERE id = ?', [answer, id]);
  persist(db);
}

export function getConversations(): Conversation[] {
  if (!db) return [];
  const result = db.exec(
    'SELECT id, user_name, question, answer, created_at FROM conversations ORDER BY created_at DESC',
  );
  if (result.length === 0) return [];
  return result[0].values.map((row: unknown[]) => ({
    id: row[0] as number,
    user_name: row[1] as string,
    question: row[2] as string,
    answer: row[3] as string | null,
    created_at: row[4] as string,
  }));
}

export function clearDatabase(): void {
  if (!db) return;
  db.run('DELETE FROM conversations');
  persist(db);
}
