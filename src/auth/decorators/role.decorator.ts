import { SetMetadata } from '@nestjs/common';
import { ROLE } from '../../libs/enums/role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (roles: ROLE) => SetMetadata(ROLES_KEY, roles);
