import { BaseApiService, User } from "@yusr_systems/core";

export class UsersApiService extends BaseApiService<User>
{
  routeName: string = "Users";
}
