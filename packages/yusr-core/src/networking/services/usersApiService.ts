import { BaseApiService, User } from "@yusr_systems/core";

export default class UsersApiService extends BaseApiService<User>
{
  routeName: string = "Users";
}
