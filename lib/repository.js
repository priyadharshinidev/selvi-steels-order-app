import { getSqlPool, isDbConfigured, sql } from "@/lib/db";
import { getMockStore } from "@/lib/mockStore";

function mapProducts(rows) {
  const productMap = new Map();

  rows.forEach((row) => {
    if (!productMap.has(row.ProductId)) {
      productMap.set(row.ProductId, {
        id: row.ProductId,
        name: row.Name,
        designCode: row.DesignCode,
        imageUrl: row.ImageUrl || "",
        imageData: "",
        color: row.BodyColor,
        accent: row.AccentColor,
        variants: []
      });
    }

    if (row.VariantId) {
      productMap.get(row.ProductId).variants.push({
        id: row.VariantId,
        size: row.Size,
        weight: row.Weight,
        price: Number(row.Price)
      });
    }
  });

  return Array.from(productMap.values());
}

export async function findUserByLogin(name, phone) {
  if (!isDbConfigured()) {
    return getMockStore().users.find(
      (user) =>
        user.name.toLowerCase() === name.toLowerCase() && user.phone === phone
    );
  }

  const pool = await getSqlPool();
  const result = await pool
    .request()
    .input("name", sql.NVarChar(120), name)
    .input("phone", sql.NVarChar(20), phone)
    .query(`
      SELECT TOP 1 UserId, Name, Phone, Role, BusinessName
      FROM dbo.Users
      WHERE LOWER(Name) = LOWER(@name)
        AND Phone = @phone
        AND IsActive = 1
    `);

  const user = result.recordset[0];
  if (!user) return null;

  return {
    id: user.UserId,
    name: user.Name,
    phone: user.Phone,
    role: user.Role,
    businessName: user.BusinessName
  };
}

export async function listProducts() {
  if (!isDbConfigured()) return getMockStore().products;

  const pool = await getSqlPool();
  const result = await pool.request().query(`
    SELECT
      p.ProductId,
      p.Name,
      p.DesignCode,
      p.ImageUrl,
      p.BodyColor,
      p.AccentColor,
      v.VariantId,
      v.Size,
      v.Weight,
      v.Price
    FROM dbo.Products p
    LEFT JOIN dbo.ProductVariants v
      ON p.ProductId = v.ProductId
      AND v.IsActive = 1
    WHERE p.IsActive = 1
    ORDER BY p.ProductId, v.VariantId
  `);

  return mapProducts(result.recordset);
}

export async function saveProduct(product) {
  if (!isDbConfigured()) {
    const mockProducts = getMockStore().products;
    const productId = product.id || Date.now();
    const savedProduct = { ...product, id: productId };
    const index = mockProducts.findIndex((item) => item.id === productId);
    if (index >= 0) mockProducts[index] = savedProduct;
    else mockProducts.push(savedProduct);
    return savedProduct;
  }

  const pool = await getSqlPool();
  const transaction = new sql.Transaction(pool);
  await transaction.begin();

  try {
    let productId = Number(product.id);

    if (productId) {
      await new sql.Request(transaction)
        .input("productId", sql.Int, productId)
        .input("name", sql.NVarChar(160), product.name)
        .input("designCode", sql.NVarChar(50), product.designCode)
        .input("imageUrl", sql.NVarChar(1000), product.imageUrl || "")
        .input("bodyColor", sql.NVarChar(20), product.color)
        .input("accentColor", sql.NVarChar(20), product.accent)
        .query(`
          UPDATE dbo.Products
          SET Name = @name,
              DesignCode = @designCode,
              ImageUrl = @imageUrl,
              BodyColor = @bodyColor,
              AccentColor = @accentColor,
              UpdatedAt = SYSUTCDATETIME()
          WHERE ProductId = @productId
        `);

      await new sql.Request(transaction)
        .input("productId", sql.Int, productId)
        .query("DELETE FROM dbo.ProductVariants WHERE ProductId = @productId");
    } else {
      const insertResult = await new sql.Request(transaction)
        .input("name", sql.NVarChar(160), product.name)
        .input("designCode", sql.NVarChar(50), product.designCode)
        .input("imageUrl", sql.NVarChar(1000), product.imageUrl || "")
        .input("bodyColor", sql.NVarChar(20), product.color)
        .input("accentColor", sql.NVarChar(20), product.accent)
        .query(`
          INSERT INTO dbo.Products
            (Name, DesignCode, ImageUrl, BodyColor, AccentColor)
          OUTPUT INSERTED.ProductId
          VALUES
            (@name, @designCode, @imageUrl, @bodyColor, @accentColor)
        `);
      productId = insertResult.recordset[0].ProductId;
    }

    for (const variant of product.variants) {
      await new sql.Request(transaction)
        .input("productId", sql.Int, productId)
        .input("size", sql.NVarChar(40), variant.size)
        .input("weight", sql.NVarChar(40), variant.weight)
        .input("price", sql.Decimal(10, 2), Number(variant.price))
        .query(`
          INSERT INTO dbo.ProductVariants (ProductId, Size, Weight, Price)
          VALUES (@productId, @size, @weight, @price)
        `);
    }

    await transaction.commit();
    return { ...product, id: productId };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function deleteProduct(productId) {
  if (!isDbConfigured()) {
    const mockProducts = getMockStore().products;
    const index = mockProducts.findIndex((product) => product.id === productId);
    if (index >= 0) mockProducts.splice(index, 1);
    return;
  }

  const pool = await getSqlPool();
  await pool
    .request()
    .input("productId", sql.Int, Number(productId))
    .query(`
      UPDATE dbo.Products
      SET IsActive = 0, UpdatedAt = SYSUTCDATETIME()
      WHERE ProductId = @productId
    `);
}

export async function createOrder(payload) {
  const items = Array.isArray(payload.items) ? payload.items : [];
  const total = items.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  if (!isDbConfigured()) {
    const mockOrders = getMockStore().orders;
    const order = {
      id: `ORD-${Date.now()}`,
      customerName: payload.customerName,
      phone: payload.phone,
      items,
      total,
      status: "Pending",
      createdAt: new Date().toISOString().slice(0, 10)
    };
    mockOrders.unshift(order);
    return order;
  }

  const pool = await getSqlPool();
  const transaction = new sql.Transaction(pool);
  await transaction.begin();

  try {
    const orderNo = `ORD-${Date.now()}`;
    const orderResult = await new sql.Request(transaction)
      .input("orderNo", sql.NVarChar(40), orderNo)
      .input("customerName", sql.NVarChar(120), payload.customerName)
      .input("phone", sql.NVarChar(20), payload.phone)
      .input("total", sql.Decimal(10, 2), total)
      .query(`
        INSERT INTO dbo.Orders (OrderNo, CustomerName, Phone, Total)
        OUTPUT INSERTED.OrderId, INSERTED.OrderNo, INSERTED.CreatedAt
        VALUES (@orderNo, @customerName, @phone, @total)
      `);

    const order = orderResult.recordset[0];

    for (const item of items) {
      await new sql.Request(transaction)
        .input("orderId", sql.Int, order.OrderId)
        .input("productId", sql.Int, Number(item.productId) || null)
        .input("variantId", sql.Int, Number(item.variantId) || null)
        .input("productName", sql.NVarChar(160), item.name)
        .input("designCode", sql.NVarChar(50), item.designCode || "")
        .input("size", sql.NVarChar(40), item.size)
        .input("weight", sql.NVarChar(40), item.weight)
        .input("quantity", sql.Int, Number(item.quantity))
        .input("price", sql.Decimal(10, 2), Number(item.price))
        .query(`
          INSERT INTO dbo.OrderItems
            (OrderId, ProductId, VariantId, ProductName, DesignCode, Size, Weight, Quantity, Price)
          VALUES
            (@orderId, @productId, @variantId, @productName, @designCode, @size, @weight, @quantity, @price)
        `);
    }

    await transaction.commit();

    return {
      id: order.OrderNo,
      customerName: payload.customerName,
      phone: payload.phone,
      items,
      total,
      status: "Pending",
      createdAt: order.CreatedAt.toISOString().slice(0, 10)
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function listOrders() {
  if (!isDbConfigured()) return getMockStore().orders;

  const pool = await getSqlPool();
  const result = await pool.request().query(`
    SELECT
      o.OrderId,
      o.OrderNo,
      o.CustomerName,
      o.Phone,
      o.Total,
      o.Status,
      o.CreatedAt,
      i.ProductName,
      i.DesignCode,
      i.Size,
      i.Weight,
      i.Quantity,
      i.Price
    FROM dbo.Orders o
    LEFT JOIN dbo.OrderItems i ON o.OrderId = i.OrderId
    ORDER BY o.CreatedAt DESC, o.OrderId DESC
  `);

  const orderMap = new Map();
  result.recordset.forEach((row) => {
    if (!orderMap.has(row.OrderId)) {
      orderMap.set(row.OrderId, {
        id: row.OrderNo,
        customerName: row.CustomerName,
        phone: row.Phone,
        total: Number(row.Total),
        status: row.Status,
        createdAt: row.CreatedAt.toISOString().slice(0, 10),
        items: []
      });
    }

    if (row.ProductName) {
      orderMap.get(row.OrderId).items.push({
        name: row.ProductName,
        designCode: row.DesignCode,
        size: row.Size,
        weight: row.Weight,
        quantity: row.Quantity,
        price: Number(row.Price)
      });
    }
  });

  return Array.from(orderMap.values());
}
