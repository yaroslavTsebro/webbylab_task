import { UserRepository } from './user.repository';

export const userRepositoryFactory = () => {
  return UserRepository.init();
}