export function convertWindSpeed(speedInMetersPerSecond: number): string {
    const speedInKilometersPerHour = speedInMetersPerSecond / 1000 * 60 * 60; //conversion from m/s to km/h
    return `${speedInKilometersPerHour.toFixed(2)} km/h`;
}