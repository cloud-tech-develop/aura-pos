import { Product } from '@module-catalog/products/interfaces';

export interface LabelProduct {
  id: number;
  name: string;
  sku: string | null;
  category_name: string | null;
  barcode: string | null;
  sale_price: number;
  selected: boolean;
  copies: number;
  generatedBarcode: string | null;
  isGenerating: boolean;
  isSaved: boolean;
}

export function toLabelProduct(product: Product): LabelProduct {
  return {
    id: product.id,
    name: product.name,
    sku: product.sku,
    category_name: product.category_name,
    barcode: product.barcode,
    sale_price: product.sale_price,
    selected: false,
    copies: 1,
    generatedBarcode: null,
    isGenerating: false,
    isSaved: false,
  };
}

export interface LabelPrintSettings {
  columns: number;
  fontSizeTitle: number;
  fontSizeCode: number;
  showPrice: boolean;
  showName: boolean;
  maxNameChars: number;
  spacing: number;
  labelWidth: number;
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
  skipLabels: number;
  alignEnd: boolean;
  savePaper: boolean;
}
