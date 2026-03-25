export interface BookAttachmentModel {
  id: number;
  bookId: number;
  fileUrl?: string;   
  file?: File;        
}