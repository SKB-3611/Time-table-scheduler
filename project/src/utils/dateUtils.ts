export function getCurrentDay(): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date().getDay();
  return days[today];
}

export function isUpcoming(startTime: string): boolean {
  const [hours, minutes] = startTime.split(':').map(Number);
  const now = new Date();
  const classTime = new Date();
  classTime.setHours(hours, minutes);
  return classTime > now;
}

export function sortByTime(a: { startTime: string }, b: { startTime: string }): number {
  const [aHours, aMinutes] = a.startTime.split(':').map(Number);
  const [bHours, bMinutes] = b.startTime.split(':').map(Number);
  return (aHours * 60 + aMinutes) - (bHours * 60 + bMinutes);
}