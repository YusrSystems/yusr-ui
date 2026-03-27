import { BaseApiService, Branch } from "@yusr_systems/core";

export class BranchesApiService extends BaseApiService<Branch>
{
  routeName: string = "Branches";
}
