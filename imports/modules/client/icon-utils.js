export const getBatteryIcon = intensity => {
  switch (intensity) {
    case 'low':
      return 'battery-charging-20';
    case 'medium':
      return 'battery-charging-40';
    case 'high':
      return 'battery-charging-100';
    default:
      return 'battery-charging-100';
  }
};

export const getWeatherIcon = weatherIconUrl => {
  const weatherCondition = weatherIconUrl
    .split('/')
    .pop()
    .split('#')[0]
    .split('?')[0]
    .split('.')[0];

  switch (weatherCondition) {
    case '01d':
      return 'weather-sunny';
    case '01n':
      return 'weather-sunny';
    case '02d':
      return 'weather-partlycloudy';
    case '02n':
      return 'weather-partlycloudy';
    case '03d':
      return 'weather-cloudy';
    case '03n':
      return 'weather-cloudy';
    case '04d':
      return 'weather-cloudy';
    case '04n':
      return 'weather-cloudy';
    case '09d':
      return 'weather-pouring';
    case '09n':
      return 'weather-pouring';
    case '10d':
      return 'weather-rainy';
    case '10n':
      return 'weather-rainy';
    case '11d':
      return 'weather-lightning';
    case '11n':
      return 'weather-lightning';
    case '13d':
      return 'weather-snowy';
    case '13n':
      return 'weather-snowy';
    case '50d':
      return 'weather-fog';
    case '50n':
      return 'weather-fog';
    default:
      return 'weather-sunny';
  }
};

export const getStateIcon = state => {
  switch (state) {
    case -1:
      return 'delete';
    case 0:
      return 'close-circle';
    case 1:
      return 'check';
  }
};
