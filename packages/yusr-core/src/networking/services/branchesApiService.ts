import { BaseApiService, Branch } from "@yusr_systems/core";

export default class BranchesApiService extends BaseApiService<Branch>
{
  routeName: string = "Branches";
}
