import { IUser } from './_store';
import { IGetUserResponseContractV1 } from '@/clients/pirateKingClient';

class TenantManager {
  public convertToUser(user: IGetUserResponseContractV1): IUser {
    return {
      id: user.id,
      profileImageUrl: user.profileImageUrl,
      role: user.role,
    };
  }
}

export default new TenantManager();
