import { ClientPreferences } from '../liturgy/liturgy.entity';

export class UserPreferences {
  defaultLanguage: string;
  defaultVersion: string;
  preferences: {
    [language: string]: {
      [version: string]: {
        [liturgy: string]: ClientPreferences;
      }
    }
  }
}

export class User {
  firstName?: string;
  lastName?: string;
  login: string;
  preferences?: UserPreferences;
  token?: string;
}

export class Role {
  id: string;
  label: string;
  type: string;
  status: string;
  created: Date;
  lastUpdated: Date;
  assignmentType: string;
  _links?: {
    [x: string]: {
      [x: string]: string;
    }
  };
}

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
