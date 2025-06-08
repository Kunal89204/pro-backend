export const formatDuration = (input: number | string | bigint): string => {
    const seconds = typeof input === "bigint" ? Number(input) : Number(input); // Convert to number
  
    if (isNaN(seconds) || seconds < 0) return "0:00"; // Handle invalid cases
  
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
  
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };