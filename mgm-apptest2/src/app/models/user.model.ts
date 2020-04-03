export class Group {
  id: string;
  created: Date;
  lastUpdated: Date;
  lastMembershipUpdated: Date;
  objectClass: any[];
  type: string;
  profile: {
    name: string;
    description: string;
  };
  _links: any;
}

export class Profile {
  login: string;
  email: string;
  firstName?: string;
  lastName?: string;
}
