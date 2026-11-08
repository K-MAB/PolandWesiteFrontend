import type { LocalizedContent } from "@/core/domain/models";

export interface CatalogCategory {
  id: string;
  name: LocalizedContent;
  description: LocalizedContent;
  imageUrl: string;
}

export const catalogCategories: readonly CatalogCategory[] = [
  {
    id: "microcontrollers",
    name: { pl: "Mikrokontrolery", en: "Microcontrollers", tr: "Mikrodenetleyiciler" },
    description: { pl: "MCU, moduły Wi-Fi i platformy embedded", en: "MCUs, Wi-Fi modules and embedded platforms", tr: "MCU, Wi-Fi modülleri ve gömülü platformlar" },
    imageUrl: "/products/microcontroller.png",
  },
  {
    id: "sensors",
    name: { pl: "Czujniki", en: "Sensors", tr: "Sensörler" },
    description: { pl: "Pomiar środowiska, ruchu i procesu", en: "Environmental, motion and process sensing", tr: "Ortam, hareket ve proses algılama" },
    imageUrl: "/products/sensor.png",
  },
  {
    id: "passives",
    name: { pl: "Elementy pasywne", en: "Passive components", tr: "Pasif komponentler" },
    description: { pl: "Rezystory, kondensatory i komponenty SMD", en: "Resistors, capacitors and SMD components", tr: "Dirençler, kondansatörler ve SMD komponentler" },
    imageUrl: "/products/capacitors.png",
  },
  {
    id: "connectors",
    name: { pl: "Złącza", en: "Connectors", tr: "Konnektörler" },
    description: { pl: "Połączenia wire-to-board i przemysłowe", en: "Wire-to-board and industrial connectivity", tr: "Kablo-kart ve endüstriyel bağlantılar" },
    imageUrl: "/products/connector.png",
  },
  {
    id: "semiconductors",
    name: { pl: "Półprzewodniki", en: "Semiconductors", tr: "Yarı iletkenler" },
    description: { pl: "Tranzystory, MOSFET-y i elementy mocy", en: "Transistors, MOSFETs and power devices", tr: "Transistörler, MOSFET'ler ve güç elemanları" },
    imageUrl: "/products/mosfet.png",
  },
  {
    id: "power",
    name: { pl: "Zasilanie", en: "Power supplies", tr: "Güç kaynakları" },
    description: { pl: "Zasilacze DIN i konwersja energii", en: "DIN rail supplies and power conversion", tr: "DIN ray güç kaynakları ve güç dönüşümü" },
    imageUrl: "/products/power-supply.png",
  },
  {
    id: "automation",
    name: { pl: "Automatyka", en: "Industrial automation", tr: "Endüstriyel otomasyon" },
    description: { pl: "Przekaźniki, moduły I/O i sterowanie", en: "Relays, I/O modules and control", tr: "Röleler, I/O modülleri ve kontrol" },
    imageUrl: "/products/io-module.png",
  },
];

export const catalogManufacturers = [
  "Bosch Sensortec",
  "Espressif Systems",
  "Hirose",
  "Infineon",
  "MEAN WELL",
  "Murata",
  "Omron",
  "Siemens",
  "STMicroelectronics",
  "Yageo",
] as const;

export function findCatalogCategory(id: string): CatalogCategory | undefined {
  return catalogCategories.find((category) => category.id === id);
}
