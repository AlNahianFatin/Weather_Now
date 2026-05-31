'use client';

import NavBar from "../components/NavBar";
import { useQuery } from "@tanstack/react-query";
import { format, fromUnixTime, parseISO } from "date-fns";
import Container from "../components/Container";
import { convertKelvinToCelsius } from "../utils/convertKelvinToCelsius";
import WeatherIcon from "../components/WeatherIcon";
import { getDayOrNightIcon } from "../utils/getDayOrNightIcon";
import WeatherDetails from "../components/WeatherDetails";
import { metersToKilometers } from "../utils/metersToKilometers";
import { convertWindSpeed } from "../utils/convertWindSpeed";
import ForecastWeatherDetail from "../components/ForecastWeatherDetail";
import { loadingCityAtom, placeAtom } from "./atom";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import WeatherSkeleton from "../components/SkeletonLoading";

type WeatherData = {
  cod: string;
  message: number;
  cnt: number;
  list: {
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      sea_level?: number;
      grnd_level?: number;
      humidity: number;
      temp_kf?: number;
    };
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
      deg: number;
      gust?: number;
    };
    visibility: number;
    pop: number;
    rain?: {
      "3h": number;
    };
    sys: {
      pod: "d" | "n";
    };
    dt_txt: string;
  }[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
};

type ErrorWithRetry = Error & { retryAfter?: number; rateLimited?: boolean };

export default function Home() {
  const [place, setPlace] = useAtom(placeAtom);
  const [loadingCity, setLoadingCity] = useAtom(loadingCityAtom);
  const [countdown, setCountdown] = useState<number>(0);

  const { isPending, data, error, refetch } = useQuery<WeatherData, ErrorWithRetry>({
    queryKey: ['repoData', place],
    queryFn: async () => {
      const response = await fetch(`/api/weather?place=${encodeURIComponent(place)}`);
      const responseData = await response.json();

      if (!response.ok) {
        const error = new Error(responseData.error || 'Failed to fetch weather data') as ErrorWithRetry;
        error.retryAfter = responseData.retryAfter;
        error.rateLimited = responseData.rateLimited;
        throw error;
      }
      return responseData;
    },
    enabled: !!place && !loadingCity && countdown === 0,
    retry: false,
  });

  // Countdown timer effect - ONLY for rate limit errors
  useEffect(() => {
    if (error && (error as ErrorWithRetry).rateLimited && (error as ErrorWithRetry).retryAfter) {
      setCountdown((error as ErrorWithRetry).retryAfter || 60);
    }
  }, [error]);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    refetch();
  }, [place, refetch]);

  const firstData = data?.list[0];

  const uniqueDates = [
    ...new Set(
      data?.list.map(
        (entry) => new Date(entry.dt * 1000).toISOString().split("T")[0],
      )
    )
  ];

  const firstDataForEachDate = uniqueDates.map((date) => {
    return data?.list.find((entry) => {
      const enrtyDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
      const entryTime = new Date(entry.dt * 1000).getHours();
      return enrtyDate === date && entryTime >= 6;
    });
  });

  if (isPending) {
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="animate-bounce">Loading...</p>
      </div>
    );
  }

  if (error) {
    const isRateLimited = (error as ErrorWithRetry).rateLimited === true;

    return (
      <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
        <NavBar location={undefined} />
        <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
          <div className="flex flex-col items-center justify-center gap-6 py-16">
            <div className="bg-red-100 border border-red-400 rounded-lg p-8 max-w-md">
              <h2 className="text-2xl font-bold text-red-800 mb-3">
                {isRateLimited ? '⏱️ Too Many Requests' : 'Unable to Fetch Weather'}
              </h2>
              <p className="text-red-700 mb-4">
                {error.message}
              </p>

              {isRateLimited && countdown > 0 && (
                <div className="mb-4 p-3 bg-red-200 rounded">
                  <p className="text-sm font-semibold text-red-900">
                    Try again in: <span className="text-lg font-bold">{countdown}s</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <NavBar location={data?.city.name} />
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        {loadingCity ? <WeatherSkeleton /> : (
          <>
            <section className="space-y-4">
              <div>
                <h2 className="flex gap-1 text-2xl items-end">
                  <p>{format(parseISO(firstData?.dt_txt ?? ''), 'EEEE')}</p>
                  <p className="text-lg">({format(parseISO(firstData?.dt_txt ?? ''), 'dd.MM.yyyy')})</p>
                </h2>
                <Container className="gap-10 px-6 items-center mt-4">
                  <div className="flex flex-col px-4">
                    <span className="text-5xl">
                      {convertKelvinToCelsius(firstData?.main.temp ?? 303.15)}°
                    </span>
                    <p className="text-xs space-x-1 whitespace-nowrap">
                      <span>Feels like</span>
                      <span>
                        {convertKelvinToCelsius(firstData?.main.feels_like ?? 303.15)}°
                      </span>
                    </p>
                    <p className="text-xs space-x-2">
                      <span>
                        {convertKelvinToCelsius(firstData?.main.temp_min ?? 303.15)}°↓ {" "}
                      </span>
                      <span>
                        {convertKelvinToCelsius(firstData?.main.temp_max ?? 303.15)}°↑ {" "}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                    {data?.list.map((d, i) => (
                      <div key={i} className="flex flex-col justify-between gap-2 items-center text-xs font-semibold">
                        <p className="whitespace-nowrap">{format(parseISO(d.dt_txt), "h:mm a")}</p>
                        <WeatherIcon iconname={getDayOrNightIcon(d?.weather[0].icon, d.dt)} />
                        <p>{convertKelvinToCelsius(d?.main.temp ?? 303.15)}°</p>
                      </div>
                    ))}
                  </div>
                </Container>
              </div>

              <div className="flex gap-4">
                <Container className="w-fit justify-center flex-col px-4 items-center">
                  <p className="capitalize text-center">{firstData?.weather[0].description}</p>
                  <WeatherIcon iconname={getDayOrNightIcon(firstData?.weather[0].icon ?? "Could not get icon", firstData?.dt ?? 1778886966)} />
                </Container>

                <Container className="bg-yellow-300/80 px-6 gap-4 justify-between overflow-x-auto">
                  <WeatherDetails
                    visibility={metersToKilometers(firstData?.visibility ?? 10000)}
                    humidity={`${firstData?.main.humidity} %`}
                    windSpeed={convertWindSpeed(firstData?.wind.speed ?? 1.58)}
                    airPressure={`${firstData?.main.pressure} hPa`}
                    sunrise={`${format(fromUnixTime(data?.city?.sunrise ?? 1778886966), "h:mm a")}`}
                    sunset={`${format(fromUnixTime(data?.city?.sunset ?? 1778934813), "h:mm a")}`} />
                </Container>
              </div>
            </section>

            <section className="flex w-full flex-col gap-4">
              <p className="text-2xl">Forecast (5 days)</p>
              {firstDataForEachDate
                .filter((data) => data !== undefined)
                .map((data, index) => (
                  <ForecastWeatherDetail
                    key={index}
                    description={data?.weather[0].description ?? "Could not get description"}
                    weatherIcon={data?.weather[0].icon ?? "01d"}
                    date={format(parseISO(data.dt_txt), 'dd.MM')}
                    day={format(parseISO(data.dt_txt), 'EEEE')}
                    feels_like={data?.main.feels_like ?? 0}
                    temp={data?.main.temp ?? 0}
                    temp_max={data?.main.temp_max ?? 0}
                    temp_min={data?.main.temp_min ?? 0}
                    airPressure={`${data?.main.pressure ?? 0} hPa`}
                    humidity={`${data?.main.humidity ?? 0} %`}
                    visibility={`${metersToKilometers(data?.visibility ?? 10000)}`}
                    windSpeed={`${convertWindSpeed(data?.wind.speed ?? 1.64)}`}
                  />
                ))
              }
            </section>
          </>
        )}
      </main>
    </div>
  );
}