import { IJwtService } from '../../shared/contracts/system/jwt';
import { JwtService } from './jwt';
import jsonwebtoken from 'jsonwebtoken';

export const makeJwtService = (): IJwtService => {
  return JwtService.init(jsonwebtoken);
}