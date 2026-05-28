import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import type { Message, Session } from '../types/database';

const DB_KEY = 'audievit_v3_db';

let db: SqlJsDatabase | null = null;
let persistTimer: ReturnType<typeof setTimeout> | null = null;

function persistImmediate(database: SqlJsDatabase) {
  const data = database.export();
  const binary = String.fromCharCode(...new Uint8Array(data));
  localStorage.setItem(DB_KEY, btoa(binary));
}

function persistDebounced() {
  if (persistTimer) clearTimeout(persistTimer);
  persistTimer = setTimeout(() => {
    if (db) persistImmediate(db);
  }, 2000);
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
  createTables(database);
  persistImmediate(database);
  return database;
}

function createTables(database: SqlJsDatabase) {
  database.run(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL
    )
  `);
  database.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
    )
  `);
}

export async function initDatabase(): Promise<void> {
  db = await loadWasm();
}

export function createSession(): number {
  if (!db) throw new Error('Database not initialized');
  const now = new Date().toISOString();
  db.run('INSERT INTO sessions (created_at) VALUES (?)', [now]);
  const result = db.exec('SELECT last_insert_rowid()');
  return result[0].values[0][0] as number;
}

export function addMessage(sessionId: number, role: 'user' | 'assistant', content: string): number {
  if (!db) throw new Error('Database not initialized');
  const now = new Date().toISOString();
  db.run(
    'INSERT INTO messages (session_id, role, content, created_at) VALUES (?, ?, ?, ?)',
    [sessionId, role, content, now],
  );
  persistDebounced();
  const result = db.exec('SELECT last_insert_rowid()');
  return result[0].values[0][0] as number;
}

export function getSessionMessages(sessionId: number): Message[] {
  if (!db) return [];
  const stmt = db.prepare(
    'SELECT id, session_id, role, content, created_at FROM messages WHERE session_id = ? ORDER BY id ASC',
  );
  stmt.bind([sessionId]);
  const messages: Message[] = [];
  while (stmt.step()) {
    const row = stmt.getAsObject() as unknown as Message;
    messages.push(row);
  }
  stmt.free();
  return messages;
}

export function getSessions(): Session[] {
  if (!db) return [];
  const stmt = db.prepare(`
    SELECT s.id, s.created_at,
      COALESCE((SELECT m.content FROM messages m WHERE m.session_id = s.id AND m.role = 'user' ORDER BY m.id ASC LIMIT 1), '') AS preview
    FROM sessions s ORDER BY s.id DESC
  `);
  const sessions: Session[] = [];
  while (stmt.step()) {
    const row = stmt.getAsObject() as unknown as Session;
    sessions.push(row);
  }
  stmt.free();
  return sessions;
}

export function getSessionPreview(sessionId: number): string {
  if (!db) return '';
  const stmt = db.prepare(
    "SELECT content FROM messages WHERE session_id = ? AND role = 'user' ORDER BY id ASC LIMIT 1",
  );
  stmt.bind([sessionId]);
  if (stmt.step()) {
    const row = stmt.getAsObject() as { content: string };
    stmt.free();
    return row.content;
  }
  stmt.free();
  return '';
}

export function deleteSession(sessionId: number): void {
  if (!db) return;
  db.run('DELETE FROM messages WHERE session_id = ?', [sessionId]);
  db.run('DELETE FROM sessions WHERE id = ?', [sessionId]);
  persistImmediate(db);
}

export function clearAllSessions(): void {
  if (!db) return;
  db.run('DELETE FROM messages');
  db.run('DELETE FROM sessions');
  persistImmediate(db);
}

export function persistNow(): void {
  if (persistTimer) clearTimeout(persistTimer);
  if (db) persistImmediate(db);
}
