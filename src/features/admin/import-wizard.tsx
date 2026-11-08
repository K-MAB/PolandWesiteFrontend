"use client";

import { CheckCircle2, Download, FileSpreadsheet, Upload, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState, type ChangeEvent } from "react";

import { Button } from "@/components/ui/button";
import { TablePagination, usePagination } from "@/components/portal/table-pagination";

const headers = ["SKU", "MPN", "Name_PL", "Name_EN", "Name_TR", "Manufacturer", "Category", "Price", "Stock", "MOQ", "QuantityIncrement", "PackagingType", "ImageURL", "TechnicalAttributes", "Status"] as const;
type Header = (typeof headers)[number];
type ParsedRow = Record<Header, string> & { rowNumber: number; errors: string[] };

function normalizeHeader(value: string) { return value.replace(/[\s_-]/g, "").toLowerCase(); }
function emptyRecord(): Record<Header, string> { return Object.fromEntries(headers.map((header) => [header, ""])) as Record<Header, string>; }
function validateRow(values: Record<Header, string>, rowNumber: number, required: string, invalidNumber: string): ParsedRow {
  const errors: string[] = [];
  for (const field of ["SKU", "MPN", "Name_PL", "Manufacturer", "Category"] as const) if (!values[field]) errors.push(`${field}: ${required}`);
  for (const field of ["Price", "Stock", "MOQ", "QuantityIncrement"] as const) {
    const number = Number(values[field]);
    if (!Number.isFinite(number) || number < (field === "Price" || field === "Stock" ? 0 : 1)) errors.push(`${field}: ${invalidNumber}`);
  }
  return { ...values, rowNumber, errors };
}

export function ImportWizard() {
  const t = useTranslations("portal");
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const validRows = rows.filter((row) => row.errors.length === 0);
  const pagination = usePagination(rows, 10);

  const downloadTemplate = async () => {
    const ExcelJS = await import("exceljs");
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Products");
    sheet.addRow(headers);
    sheet.addRow(["VC-SEN-00051", "BME680", "Czujnik środowiskowy", "Environmental sensor", "Ortam sensörü", "Bosch Sensortec", "sensors", 42.9, 1200, 1, 1, "reel", "/products/sensor.png", "interface=I2C;voltage=3.3V", "active"]);
    sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
    sheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF101F35" } };
    sheet.columns.forEach((column) => { column.width = 20; });
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([new Uint8Array(buffer)], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "vistula-product-import-template.xlsx"; anchor.click(); URL.revokeObjectURL(url);
  };

  const parse = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true); setDone(false); setFileName(file.name);
    let matrix: string[][] = [];
    if (file.name.toLowerCase().endsWith(".csv")) {
      const text = await file.text();
      matrix = text.split(/\r?\n/).filter(Boolean).map((line) => line.split(",").map((value) => value.trim().replace(/^"|"$/g, "")));
    } else {
      const ExcelJS = await import("exceljs");
      const workbook = new ExcelJS.Workbook();
      const bytes = new Uint8Array(await file.arrayBuffer());
      await workbook.xlsx.load(bytes as unknown as Parameters<typeof workbook.xlsx.load>[0]);
      const sheet = workbook.worksheets[0];
      if (sheet) sheet.eachRow((row) => { matrix.push(Array.from({ length: row.cellCount }, (_, index) => row.getCell(index + 1).text)); });
    }
    const sourceHeaders = matrix[0] ?? [];
    const mapping = new Map(sourceHeaders.map((value, index) => [normalizeHeader(value), index]));
    const parsed = matrix.slice(1).map((line, index) => {
      const values = emptyRecord();
      headers.forEach((header) => { values[header] = line[mapping.get(normalizeHeader(header)) ?? -1] ?? ""; });
      return validateRow(values, index + 2, t("required"), t("invalidNumber"));
    });
    const seen = new Set<string>();
    parsed.forEach((row) => { if (seen.has(row.SKU)) row.errors.push(`SKU: ${t("duplicateInFile")}`); seen.add(row.SKU); });
    setRows(parsed); pagination.setPage(1); setBusy(false);
  };

  return <div className="space-y-5">
    <div className="grid gap-4 lg:grid-cols-3">
      <button type="button" onClick={downloadTemplate} className="rounded-xl border border-border bg-white p-5 text-left shadow-sm transition hover:border-blue/30"><span className="grid size-10 place-items-center rounded-lg bg-blue/8 text-blue"><Download className="size-5" /></span><strong className="mt-4 block text-sm text-navy">{t("downloadTemplate")}</strong><span className="mt-1 block text-xs leading-5 text-muted">{t("importTemplateDescription")}</span></button>
      <button type="button" onClick={() => inputRef.current?.click()} className="rounded-xl border border-dashed border-slate-300 bg-white p-5 text-left shadow-sm transition hover:border-blue"><input ref={inputRef} type="file" accept=".csv,.xlsx" onChange={parse} className="sr-only" /><span className="grid size-10 place-items-center rounded-lg bg-cyan/10 text-cyan"><Upload className="size-5" /></span><strong className="mt-4 block text-sm text-navy">{t("chooseFile")}</strong><span className="mt-1 block truncate text-xs text-muted">{fileName || t("fileSizeHint")}</span></button>
      <div className="rounded-xl border border-border bg-navy p-5 text-white"><span className="grid size-10 place-items-center rounded-lg bg-white/10 text-cyan"><FileSpreadsheet className="size-5" /></span><strong className="mt-4 block text-sm">{rows.length ? t("fileReady") : t("validate")}</strong><span className="mt-1 block text-xs text-slate-400">{rows.length ? t("validationResult", { valid: validRows.length, invalid: rows.length - validRows.length }) : t("validationDescription")}</span></div>
    </div>
    {busy && <div className="h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full w-2/3 animate-pulse rounded-full bg-blue" /></div>}
    {rows.length > 0 && <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm"><div className="flex items-center justify-between border-b border-border px-4 py-3"><div><strong className="text-sm text-navy">{t("preview")}</strong><p className="text-xs text-muted">{t("parsedRows")}</p></div><Button type="button" disabled={!validRows.length || done} onClick={() => { setBusy(true); window.setTimeout(() => { setBusy(false); setDone(true); }, 650); }}>{done ? t("importComplete") : t("importRows")}</Button></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-xs"><thead className="bg-slate-50 text-muted"><tr><th className="px-4 py-3">{t("row")}</th><th className="px-4 py-3">SKU / MPN</th><th className="px-4 py-3">{t("name")}</th><th className="px-4 py-3">{t("price")}</th><th className="px-4 py-3">{t("inventory")}</th><th className="px-4 py-3">{t("validation")}</th></tr></thead><tbody className="divide-y divide-border">{pagination.items.map((row) => <tr key={row.rowNumber}><td className="px-4 py-3 text-muted">{row.rowNumber}</td><td className="px-4 py-3"><strong className="block text-navy">{row.SKU || "—"}</strong><span className="font-mono text-muted">{row.MPN || "—"}</span></td><td className="px-4 py-3 text-navy">{row.Name_PL || "—"}</td><td className="px-4 py-3 tabular-nums">{row.Price || "—"} PLN</td><td className="px-4 py-3 tabular-nums">{row.Stock || "—"}</td><td className="px-4 py-3">{row.errors.length ? <span className="flex items-start gap-1.5 text-error"><XCircle className="mt-0.5 size-3.5 shrink-0" />{row.errors.join("; ")}</span> : <span className="flex items-center gap-1.5 font-bold text-success"><CheckCircle2 className="size-3.5" />{t("ready")}</span>}</td></tr>)}</tbody></table><TablePagination {...pagination} onPageChange={pagination.setPage} /></div></div>}
    {done && <div className="flex items-center gap-3 rounded-xl border border-success/20 bg-success/8 p-4 text-sm font-bold text-success"><CheckCircle2 className="size-5" />{t("productsProcessed", { count: validRows.length })}</div>}
  </div>;
}
