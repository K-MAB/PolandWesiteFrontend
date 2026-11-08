import type { Customer, Order, PriceRule, Product } from "@/core/domain/models";

const productSeeds = [
  {
    mpn: "STM32F407VGT6",
    manufacturer: "STMicroelectronics",
    categoryId: "microcontrollers",
    category: ["Mikrokontrolery", "Microcontrollers", "Mikrodenetleyiciler"],
    name: ["Mikrokontroler ARM Cortex-M4", "ARM Cortex-M4 Microcontroller", "ARM Cortex-M4 Mikrodenetleyici"],
    basePrice: 48.9,
    stock: 1840,
    moq: 1,
    increment: 1,
    packaging: "tray" as const,
    attributes: ["168 MHz", "1 MB Flash", "LQFP-100"],
    imageUrl: "/products/microcontroller.png",
  },
  {
    mpn: "ESP32-S3-WROOM-1-N16R8",
    manufacturer: "Espressif Systems",
    categoryId: "microcontrollers",
    category: ["Mikrokontrolery", "Microcontrollers", "Mikrodenetleyiciler"],
    name: ["Moduł Wi-Fi i Bluetooth LE", "Wi-Fi and Bluetooth LE Module", "Wi-Fi ve Bluetooth LE Modülü"],
    basePrice: 31.6,
    stock: 5260,
    moq: 1,
    increment: 1,
    packaging: "reel" as const,
    attributes: ["240 MHz", "16 MB Flash", "8 MB PSRAM"],
    imageUrl: "/products/wireless-module.png",
  },
  {
    mpn: "BME280",
    manufacturer: "Bosch Sensortec",
    categoryId: "sensors",
    category: ["Czujniki", "Sensors", "Sensörler"],
    name: ["Czujnik środowiskowy 3-w-1", "3-in-1 Environmental Sensor", "3'ü 1 Arada Ortam Sensörü"],
    basePrice: 18.4,
    stock: 3120,
    moq: 5,
    increment: 5,
    packaging: "reel" as const,
    attributes: ["I²C / SPI", "1.8–3.6 V", "LGA-8"],
    imageUrl: "/products/sensor.png",
  },
  {
    mpn: "RC0603FR-0710KL",
    manufacturer: "Yageo",
    categoryId: "passives",
    category: ["Rezystory", "Resistors", "Dirençler"],
    name: ["Rezystor SMD 10 kΩ 1%", "10 kΩ 1% SMD Resistor", "10 kΩ %1 SMD Direnç"],
    basePrice: 0.032,
    stock: 186000,
    moq: 100,
    increment: 100,
    packaging: "reel" as const,
    attributes: ["10 kΩ", "1%", "0603"],
    imageUrl: "/products/resistors.png",
  },
  {
    mpn: "GRM188R71H104KA93D",
    manufacturer: "Murata",
    categoryId: "passives",
    category: ["Kondensatory", "Capacitors", "Kondansatörler"],
    name: ["Kondensator MLCC 100 nF", "100 nF MLCC Capacitor", "100 nF MLCC Kondansatör"],
    basePrice: 0.084,
    stock: 96000,
    moq: 100,
    increment: 100,
    packaging: "reel" as const,
    attributes: ["100 nF", "50 V", "X7R"],
    imageUrl: "/products/capacitors.png",
  },
  {
    mpn: "DF13-10P-1.25DSA",
    manufacturer: "Hirose",
    categoryId: "connectors",
    category: ["Złącza", "Connectors", "Konnektörler"],
    name: ["Złącze przewód-płytka 10 pin", "10-pin Wire-to-board Header", "10 Pin Kablo-Kart Konnektörü"],
    basePrice: 4.76,
    stock: 8460,
    moq: 10,
    increment: 10,
    packaging: "tray" as const,
    attributes: ["10 pin", "1.25 mm", "Vertical"],
    imageUrl: "/products/connector.png",
  },
  {
    mpn: "IRLZ44NPBF",
    manufacturer: "Infineon",
    categoryId: "semiconductors",
    category: ["Tranzystory", "Transistors", "Transistörler"],
    name: ["Tranzystor MOSFET N 55 V", "55 V N-channel MOSFET", "55 V N Kanal MOSFET"],
    basePrice: 5.95,
    stock: 2140,
    moq: 5,
    increment: 5,
    packaging: "tube" as const,
    attributes: ["55 V", "47 A", "TO-220AB"],
    imageUrl: "/products/mosfet.png",
  },
  {
    mpn: "HDR-60-24",
    manufacturer: "MEAN WELL",
    categoryId: "power",
    category: ["Zasilacze", "Power Supplies", "Güç Kaynakları"],
    name: ["Zasilacz DIN 24 V 60 W", "24 V 60 W DIN Rail Supply", "24 V 60 W DIN Ray Güç Kaynağı"],
    basePrice: 82.7,
    stock: 385,
    moq: 1,
    increment: 1,
    packaging: "box" as const,
    attributes: ["24 V DC", "60 W", "DIN rail"],
    imageUrl: "/products/power-supply.png",
  },
  {
    mpn: "G2R-1-E-DC24",
    manufacturer: "Omron",
    categoryId: "automation",
    category: ["Przekaźniki", "Relays", "Röleler"],
    name: ["Przekaźnik mocy SPDT 24 V", "24 V SPDT Power Relay", "24 V SPDT Güç Rölesi"],
    basePrice: 24.2,
    stock: 740,
    moq: 1,
    increment: 1,
    packaging: "box" as const,
    attributes: ["SPDT", "24 V DC", "16 A"],
    imageUrl: "/products/relay.png",
  },
  {
    mpn: "6ES7131-6BF01-0BA0",
    manufacturer: "Siemens",
    categoryId: "automation",
    category: ["Automatyka", "Industrial Automation", "Endüstriyel Otomasyon"],
    name: ["Moduł wejść cyfrowych ET 200SP", "ET 200SP Digital Input Module", "ET 200SP Dijital Giriş Modülü"],
    basePrice: 428,
    stock: 46,
    moq: 1,
    increment: 1,
    packaging: "box" as const,
    attributes: ["8 DI", "24 V DC", "ET 200SP"],
    imageUrl: "/products/io-module.png",
  },
] as const;

function localized(pl: string, en: string, tr: string) {
  return { pl, en, tr };
}

export const mockProducts: readonly Product[] = Array.from({ length: 50 }, (_, index) => {
  const seed = productSeeds[index % productSeeds.length]!;
  const batch = Math.floor(index / productSeeds.length) + 1;
  const priceFactor = 1 + (batch - 1) * 0.035;
  const baseAmount = Math.round(seed.basePrice * priceFactor * 1000) / 1000;

  return {
    id: `product-${String(index + 1).padStart(3, "0")}`,
    sku: `VC-${seed.categoryId.slice(0, 3).toUpperCase()}-${String(index + 1).padStart(5, "0")}`,
    mpn: batch === 1 ? seed.mpn : `${seed.mpn}-${batch}`,
    manufacturer: seed.manufacturer,
    categoryId: seed.categoryId,
    categoryName: localized(seed.category[0], seed.category[1], seed.category[2]),
    name: localized(seed.name[0], seed.name[1], seed.name[2]),
    description: localized(
      `Komponent klasy przemysłowej: ${seed.attributes.join(", ")}.`,
      `Industrial-grade component: ${seed.attributes.join(", ")}.`,
      `Endüstriyel sınıf komponent: ${seed.attributes.join(", ")}.`,
    ),
    imageUrl: seed.imageUrl,
    stock: Math.max(0, seed.stock - (batch - 1) * Math.ceil(seed.stock * 0.14)),
    moq: seed.moq,
    quantityIncrement: seed.increment,
    packagingType: seed.packaging,
    leadTimeDays: seed.stock > 100 ? 1 : 7,
    unitOfMeasure: "pcs",
    basePrice: { amount: baseAmount, currency: "PLN" },
    volumePrices: [
      { minQuantity: seed.moq, unitPrice: { amount: baseAmount, currency: "PLN" } },
      { minQuantity: Math.max(seed.moq * 10, 10), unitPrice: { amount: Math.round(baseAmount * 0.94 * 1000) / 1000, currency: "PLN" } },
      { minQuantity: Math.max(seed.moq * 50, 100), unitPrice: { amount: Math.round(baseAmount * 0.86 * 1000) / 1000, currency: "PLN" } },
    ],
    attributes: seed.attributes.map((value, attributeIndex) => ({
      code: `spec-${attributeIndex + 1}`,
      label: localized(`Parametr ${attributeIndex + 1}`, `Specification ${attributeIndex + 1}`, `Özellik ${attributeIndex + 1}`),
      value,
      filterable: true,
    })),
    datasheetUrl: `/documents/${seed.mpn.toLowerCase()}.pdf`,
    status: "active",
  };
});

function address(customerId: string, city: string, postalCode: string) {
  return {
    id: `address-${customerId}`,
    label: "Home",
    street: "ul. Przemysłowa 12",
    city,
    postalCode,
    countryCode: "PL" as const,
  };
}

export const mockCustomers: readonly Customer[] = [
  ["customer-anna", "Anna Wiśniewska", "anna@example.com", "Warszawa", "00-842"],
  ["customer-piotr", "Piotr Nowak", "piotr@example.com", "Gdańsk", "80-309"],
  ["customer-ewa", "Ewa Lewandowska", "ewa@example.com", "Wrocław", "54-203"],
  ["customer-tomasz", "Tomasz Zieliński", "tomasz@example.com", "Katowice", "40-101"],
  ["customer-maria", "Maria Kamińska", "maria@example.com", "Poznań", "60-541"],
].map(([id, name, email, city, postalCode], index) => ({ id: String(id), name: String(name), email: String(email), status: "active" as const, createdAt: new Date(Date.UTC(2026, 2 + index, 10)).toISOString(), address: address(String(id), String(city), String(postalCode)) }));

export const mockPriceRules: readonly PriceRule[] = mockProducts.flatMap((product) => {
  return product.volumePrices.slice(1).map((tier, tierIndex) => ({
    id: `rule-volume-${product.id}-${tierIndex + 1}`,
    productId: product.id,
    type: "volume" as const,
    unitPrice: tier.unitPrice,
    minQuantity: tier.minQuantity,
  }));
});

export const mockOrders: readonly Order[] = mockCustomers.flatMap((customer, customerIndex) =>
  Array.from({ length: 3 }, (_, index) => ({
    id: `order-${customerIndex + 1}-${index + 1}`,
    customerId: customer.id,
    customerName: customer.name,
    orderNumber: `VC-2026-${customerIndex + 1}${String(index + 1).padStart(3, "0")}`,
    status: (["confirmed", "processing", "delivered"] as const)[index]!,
    total: { amount: 1850 + customerIndex * 620 + index * 310, currency: "PLN" },
    createdAt: new Date(Date.UTC(2026, 8 + index, 5 + customerIndex)).toISOString(),
  })),
);
