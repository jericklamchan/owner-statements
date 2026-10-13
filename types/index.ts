export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export interface PropertyRecord {
  id: string;
  propertyName: string;
  ownerName: string;
  address: string;
  city: string;
  country: string;
  avatarInitials: string;
  status: 'created' | 'deleted';
}