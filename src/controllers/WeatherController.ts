import { Logger } from '@overnightjs/logger';
import { Request, Response } from 'express';
import { inject } from 'inversify';
import {
  BaseHttpController,
  controller,
  httpGet,
  request,
  response,
} from 'inversify-express-utils';
import { Types } from '../constants/Types';
import { WeatherService } from '../services/WeatherService';

@controller('/api/weather')
export class WeatherController extends BaseHttpController {
  private readonly weatherService: WeatherService;

  public constructor(
    @inject(Types.WeatherService) weatherService: WeatherService
  ) {
    super();
    this.weatherService = weatherService;
  }

  @httpGet('/')
  private async GetWeatherData(
    @request() req: Request,
    @response() res: Response
  ) {
    try {
      const data = await this.weatherService.GetWeatherData();
      return this.ok(data);
    } catch (error) {
      Logger.Err(error);
    }
  }
}
