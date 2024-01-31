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
  brandName: string;
  upc?: string;
  searchKeywords: string;
  quantity: number;
  price: number;
  shippingPrice: number;
  map?: number;
};

type ParseExcelDataProps = Omit<InsertExcelDataProps, "excelId">;

type FindExcelDataByDateRangeProps = {
  id: string;
  date: Date;
  quantity: number;
  price: number;
  shipping_price: number;
  map: number | null;
  part_detail_id: string;
};
