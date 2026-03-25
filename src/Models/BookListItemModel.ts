export interface BookListItemModel {
  id: number;
  title: string;
  price: number;
  discountPercent?: number;
  priceBeforeDiscount?: number;
  categoryId: number;
  publisherId: number;
  authorId: number;
  edition?: string;
  volume?: number;
  shortDescription?: string;
  details?: string;
  coverPhotoUrl?: string;
  publishDate?: string;    
  registerDate: string;
  registeredBy: number;
  status: number;
  category: string;
  publisher: string;
  author: string;
  registeredUser: string;
  features: string [];
}