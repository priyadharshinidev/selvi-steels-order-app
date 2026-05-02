INSERT INTO dbo.Users (Name, Phone, Role, BusinessName)
VALUES
  ('Owner', '9999999999', 'owner', 'Selvi Steels'),
  ('Kumar Stores', '9876543210', 'customer', 'Kumar Furniture Stores');

INSERT INTO dbo.Products (Name, DesignCode, ImageUrl, BodyColor, AccentColor)
VALUES
  ('Classic Straight Leg', 'CL-01', '', '#245a6b', '#d9a441'),
  ('Box Type Heavy Leg', 'BX-02', '', '#6f3d2e', '#93b7be'),
  ('Rounded Bend Leg', 'RB-03', '', '#304c3b', '#e17855'),
  ('Premium Cross Support', 'PC-04', '', '#4a4f66', '#dfc86f');

INSERT INTO dbo.ProductVariants (ProductId, Size, Weight, Price)
SELECT ProductId, '40*44', '2kg', 185 FROM dbo.Products WHERE DesignCode = 'CL-01'
UNION ALL SELECT ProductId, '40*44', '3kg', 235 FROM dbo.Products WHERE DesignCode = 'CL-01'
UNION ALL SELECT ProductId, '38*40', '2kg', 170 FROM dbo.Products WHERE DesignCode = 'CL-01'
UNION ALL SELECT ProductId, '38*40', '3kg', 245 FROM dbo.Products WHERE DesignCode = 'BX-02'
UNION ALL SELECT ProductId, '40*44', '3kg', 265 FROM dbo.Products WHERE DesignCode = 'BX-02'
UNION ALL SELECT ProductId, '40*44', '4kg', 330 FROM dbo.Products WHERE DesignCode = 'BX-02'
UNION ALL SELECT ProductId, '40*44', '4kg', 310 FROM dbo.Products WHERE DesignCode = 'RB-03'
UNION ALL SELECT ProductId, '38*40', '3kg', 260 FROM dbo.Products WHERE DesignCode = 'RB-03'
UNION ALL SELECT ProductId, '38*40', '4kg', 355 FROM dbo.Products WHERE DesignCode = 'PC-04'
UNION ALL SELECT ProductId, '40*44', '4kg', 385 FROM dbo.Products WHERE DesignCode = 'PC-04';
