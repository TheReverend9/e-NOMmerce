export type LineItem = {
  id: number;
  product_id: number;
  name: string;
  quantity: number;
  total: string;         
  price?: string;        
  subtotal?: string;
};

export type BillingInfo = {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  address_1: string;
};

export type ShippingLine = {
  method_title: string;
};

export type Order = {
  id: number;
  date_created: string;
  billing: BillingInfo;
  line_items: LineItem[];
  customer_note?: string;
  total: string;
  payment_method_title: string;
  status: string;
  shipping_lines: ShippingLine[];
};