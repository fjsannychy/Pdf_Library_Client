import type { UserActivityViewModel } from "./UserActivityViewModel";

export interface ProfileViewModel {
  id: number;
  username: string;
  fullname: string;
  role: string;
  favorites: UserActivityViewModel[];
  recentActivity: UserActivityViewModel[];
  purchasedBooks: any[];
}