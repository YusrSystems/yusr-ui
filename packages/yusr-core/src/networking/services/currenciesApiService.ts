import { ApiConstants, BaseFilterableApiService, Currency, FilterCondition, YusrApiHelper, type FilterResult, type RequestResult } from "@yusr_systems/core";

export class CurrenciesApiService extends BaseFilterableApiService<Currency>
{
  routeName: string = "Currencies";

  async Filter(
    pageNumber: number,
    rowsPerPage: number,
    condition?: FilterCondition
  ): Promise<RequestResult<FilterResult<Currency>>>
  {
    return await YusrApiHelper.Post(
      `${ApiConstants.baseUrl}/${this.routeName}/Filter?pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}`,
      condition
    );
  }
}
