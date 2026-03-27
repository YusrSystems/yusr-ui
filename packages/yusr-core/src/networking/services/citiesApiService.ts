import { ApiConstants, BaseFilterableApiService, City, FilterCondition, YusrApiHelper, type FilterResult, type RequestResult } from "@yusr_systems/core";

export class CitiesApiService extends BaseFilterableApiService<City>
{
  routeName: string = "Cities";

  async Filter(
    pageNumber: number,
    rowsPerPage: number,
    condition?: FilterCondition
  ): Promise<RequestResult<FilterResult<City>>>
  {
    return await YusrApiHelper.Post(
      `${ApiConstants.baseUrl}/${this.routeName}/Filter?pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}`,
      condition
    );
  }
}
