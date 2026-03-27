import { BaseApiService, Role } from "@yusr_systems/core";

export default class RolesApiService extends BaseApiService<Role>
{
  routeName: string = "Roles";
}
