import { Profile } from './user';

declare global {
  namespace Express {
    interface Request {
      user?: Profile;
    }
  }
}