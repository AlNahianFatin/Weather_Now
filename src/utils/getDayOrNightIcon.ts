export function getDayOrNightIcon(iconName: string, dateTimeString: string): string {
    const hours = new Date(dateTimeString).getHours(); //get hours from the given date and time in string

    const isDayTime = hours >= 6 && hours < 18; //consider day time from 6AM to 6PM

    return isDayTime ? iconName.replace(/.$/, "d") : iconName.replace(/.$/, "n")
}