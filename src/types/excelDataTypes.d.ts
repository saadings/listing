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
