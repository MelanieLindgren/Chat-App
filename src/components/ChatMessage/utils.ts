export function setTimestamp(date: Date, dateNow: Date, timestamp: string) {

    const time = date.toLocaleTimeString(navigator.language, {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (date.getFullYear() !== dateNow.getFullYear()) {
      timestamp =
        date.toLocaleDateString("en-gb", { dateStyle: "medium" }) + " " + time;
    } else if (
      date.getMonth() !== dateNow.getMonth() ||
      date.getDate() < dateNow.getDate() - 6
    ) {
      timestamp =
        date.toLocaleDateString("en-gb", {
          weekday: "short",
          day: "numeric",
          month: "short",
        }) +
        " " +
        time;
    } else if (
      time ===
      dateNow.toLocaleTimeString(navigator.language, {
        hour: "2-digit",
        minute: "2-digit",
      })
    ) {
      timestamp = "now";
    } else if (date.getDate() === dateNow.getDate()) {
      timestamp = "today" + " " + time;
    } else if (date.getDate() === dateNow.getDate() - 1) {
      timestamp = "yesterday" + " " + time; // funkar inte när date är/blir 0
    } else {
      timestamp =
        date.toLocaleDateString("en-gb", {
          weekday: "short",
        }) +
        " " +
        time;
    }

    return timestamp;
  }