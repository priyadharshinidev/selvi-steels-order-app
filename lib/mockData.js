export const users = [
  {
    id: 1,
    name: "Owner",
    phone: "9999999999",
    role: "owner",
    businessName: "Selvi Steels"
  },
  {
    id: 2,
    name: "Kumar Stores",
    phone: "9876543210",
    role: "customer",
    businessName: "Kumar Furniture Stores"
  }
];

export const products = [
  {
    id: 1,
    name: "Classic Straight Leg",
    designCode: "CL-01",
    color: "#245a6b",
    accent: "#d9a441",
    imageUrl: "",
    imageData: "",
    variants: [
      { id: "CL-01-1", size: "40*44", weight: "2kg", price: 185 },
      { id: "CL-01-2", size: "40*44", weight: "3kg", price: 235 },
      { id: "CL-01-3", size: "38*40", weight: "2kg", price: 170 }
    ]
  },
  {
    id: 2,
    name: "Box Type Heavy Leg",
    designCode: "BX-02",
    color: "#6f3d2e",
    accent: "#93b7be",
    imageUrl: "",
    imageData: "",
    variants: [
      { id: "BX-02-1", size: "38*40", weight: "3kg", price: 245 },
      { id: "BX-02-2", size: "40*44", weight: "3kg", price: 265 },
      { id: "BX-02-3", size: "40*44", weight: "4kg", price: 330 }
    ]
  },
  {
    id: 3,
    name: "Rounded Bend Leg",
    designCode: "RB-03",
    color: "#304c3b",
    accent: "#e17855",
    imageUrl: "",
    imageData: "",
    variants: [
      { id: "RB-03-1", size: "40*44", weight: "4kg", price: 310 },
      { id: "RB-03-2", size: "38*40", weight: "3kg", price: 260 }
    ]
  },
  {
    id: 4,
    name: "Premium Cross Support",
    designCode: "PC-04",
    color: "#4a4f66",
    accent: "#dfc86f",
    imageUrl: "",
    imageData: "",
    variants: [
      { id: "PC-04-1", size: "38*40", weight: "4kg", price: 355 },
      { id: "PC-04-2", size: "40*44", weight: "4kg", price: 385 }
    ]
  }
];

export const orders = [
  {
    id: "ORD-1001",
    customerName: "Kumar Stores",
    phone: "9876543210",
    total: 980,
    status: "Pending",
    items: [
      {
        productId: 2,
        variantId: "BX-02-1",
        designCode: "BX-02",
        name: "Box Type Heavy Leg",
        size: "38*40",
        weight: "3kg",
        quantity: 4,
        price: 245
      }
    ],
    createdAt: "2026-05-01"
  }
];
