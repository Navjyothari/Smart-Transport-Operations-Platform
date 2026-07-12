import { Parser } from 'json2csv';

export function generateCsv<T extends object>(data: T[], fields?: string[]): string {
  if (data.length === 0) return '';
  const opts = fields ? { fields } : {};
  const parser = new Parser(opts);
  return parser.parse(data);
}
