import axios, { AxiosResponse } from 'axios';
import { injectable } from 'inversify';

@injectable()
export class WeatherService {
  public async GetWeatherData() {
    const weatherData: AxiosResponse<WeatherDataType> = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?id=5326561&appid=${process.env.WEATHER_API_KEY}`
    );

    return weatherData.data;
  }
}

type WeatherDataType = {
  coord: {
    lon: number;
    lat: number;
  };
  weather: [
    {
      id: number;
      main: string;
      description: string;
      icon: string;
    }
  ];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
};
