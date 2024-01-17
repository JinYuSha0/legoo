import path from 'path';

export function normalizePath(filename: string) {
  return filename.split(path.sep).join(path.posix.sep);
}

export function relativePath(cwd: string, filename: string) {
  return filename.replace(cwd, '');
}

export function removeStartSep(filename: string) {
  if (filename.startsWith('\\') || filename.startsWith('/')) {
    return filename.slice(1);
  }
  return filename;
}
