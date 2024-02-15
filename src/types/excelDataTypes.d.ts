type FindExcelFileProps = {
  name: string;
  size: number;
};

type InsertExcelFileProps = {
  name: string;
  url: string;
  size: number;
  lastModified: Date;
};

type InsertExcelDataProps = {
  excelId: string;
  inventoryDate: Date;
  vendorName: string;
  vendorPartNumber: string;
  manufacturerPartNumber: string;
  brandName?: string;
  upc?: string;
  searchKeywords?: string;
  quantity: number;
  price: number;
  shippingPrice: number;
  map?: number;
};

type ParseExcelDataProps = Omit<InsertExcelDataProps, "excelId">;

type FindExcelDataByDateRangeProps = {
  // id: string;
  // date: Date;
  // quantity: number;
  // price: number;
  // shipping_price: number;
  // part_detail_id: string;

  id: string;
  date: Date;
  vendor_name: string;
  vendor_part_number: string;
  search_keywords: string | null;
  quantity: number;
  price: number;
  shipping_price: number;
  map: number | null;
  product_id: string;
};

type ReturnVelocitiesByDateRange = {
  fromDate: Date;
  toDate: Date;
  partNumber: string;
  brand: {
    id: string;
    name: string;
  };
  vendor: {
    id: string;
    name: string;
  };
  manufacturer: {
    id: string;
    partNumber: string;
  };
  positiveVelocityQuantity: number;
  negativeVelocityQuantity: number;
  velocityPrice: number;
};
