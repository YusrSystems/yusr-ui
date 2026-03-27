import { ApiConstants, BaseFilterableApiService, Country, FilterCondition, YusrApiHelper, type FilterResult, type RequestResult } from "@yusr_systems/core";

export class CountriesApiService extends BaseFilterableApiService<Country>
{
  routeName: string = "Countries";

  async Filter(
    pageNumber: number,
    rowsPerPage: number,
    condition?: FilterCondition
  ): Promise<RequestResult<FilterResult<Country>>>
  {
    return await YusrApiHelper.Post(
      `${ApiConstants.baseUrl}/${this.routeName}/Filter?pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}`,
      condition
    );
  }
}
