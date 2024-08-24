export interface Order {
  id?:string;
  userId:string;
  orderItems:{
    productId: string | undefined;
    productName: string;
    note: string;
    status:string;
    quantity: number;
    confirmationTime: string;
  }[]
  totalPrice:number;
  
}