export interface MediaQueryDto {
  searchTerm?: string;
}

export interface Media {
  id: number;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  mediaTypeId: number;
}

export interface CreateMediaDto {
  title: string;
  description: string;
  mediaTypeId: number;
}
