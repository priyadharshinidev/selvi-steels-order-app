import { orders, products, users } from "@/lib/mockData";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function getMockStore() {
  if (!globalThis.selviSteelsMockStore) {
    globalThis.selviSteelsMockStore = {
      users: clone(users),
      products: clone(products),
      orders: clone(orders)
    };
  }

  return globalThis.selviSteelsMockStore;
}
