export function getDayOrNightIcon(iconName: string, unixTimestamp: number): string {
    const hours = new Date(unixTimestamp * 1000).getHours(); //convert unix timestamp to milliseconds
    const isDayTime = hours >= 6 && hours < 18; //consider day time from 6AM to 6PM
    return isDayTime ? iconName.replace(/.$/, "d") : iconName.replace(/.$/, "n")
}