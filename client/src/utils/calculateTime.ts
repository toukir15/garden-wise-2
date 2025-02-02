export function calculateTime(timestamp: string) {
    const now: any = new Date();
    const past: any = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);

    const seconds = diffInSeconds;
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const years = Math.floor(days / 365);

    if (seconds < 60) {
        return `now`;
    } else if (minutes < 60) {
        return `${minutes}m`;
    } else if (hours < 24) {
        return `${hours}h`;
    } else if (days < 7) {
        return `${days}d`;
    } else if (weeks < 52) {
        return `${weeks}w`;
    } else if (years) {
        return `${years}y`;
    } else {
        return ""
    }
}
