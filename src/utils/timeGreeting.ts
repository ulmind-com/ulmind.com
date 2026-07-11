export const getGreeting = (name: string): string => {
  // Get current hour in IST
  const now = new Date();
  const istTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const hour = istTime.getHours();

  let greeting = "Hello";
  if (hour >= 5 && hour < 12) {
    greeting = "Good Morning";
  } else if (hour >= 12 && hour < 17) {
    greeting = "Good Afternoon";
  } else if (hour >= 17 && hour < 21) {
    greeting = "Good Evening";
  } else {
    greeting = "Good Night";
  }

  // Ensure name is properly capitalized
  const formattedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  
  return `${greeting} ${formattedName}. Welcome to ULMIND.`;
};
