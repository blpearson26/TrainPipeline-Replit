import { useEffect } from "react";

interface ColorTheme {
  primary: string;
  ring: string;
  sidebarPrimary: string;
  sidebarRing: string;
}

const colorThemes: Record<string, ColorTheme> = {
  blue: {
    primary: "217 91% 60%",
    ring: "217 91% 60%",
    sidebarPrimary: "217 91% 60%",
    sidebarRing: "217 91% 60%",
  },
  purple: {
    primary: "271 91% 65%",
    ring: "271 91% 65%",
    sidebarPrimary: "271 91% 65%",
    sidebarRing: "271 91% 65%",
  },
  green: {
    primary: "142 76% 45%",
    ring: "142 76% 45%",
    sidebarPrimary: "142 76% 45%",
    sidebarRing: "142 76% 45%",
  },
  orange: {
    primary: "25 95% 53%",
    ring: "25 95% 53%",
    sidebarPrimary: "25 95% 53%",
    sidebarRing: "25 95% 53%",
  },
  rose: {
    primary: "351 95% 71%",
    ring: "351 95% 71%",
    sidebarPrimary: "351 95% 71%",
    sidebarRing: "351 95% 71%",
  },
  teal: {
    primary: "173 80% 40%",
    ring: "173 80% 40%",
    sidebarPrimary: "173 80% 40%",
    sidebarRing: "173 80% 40%",
  },
};

export function useColorTheme() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("color-theme");
    if (savedTheme && colorThemes[savedTheme]) {
      const theme = colorThemes[savedTheme];
      const root = document.documentElement;
      root.style.setProperty("--primary", theme.primary);
      root.style.setProperty("--ring", theme.ring);
      root.style.setProperty("--sidebar-primary", theme.sidebarPrimary);
      root.style.setProperty("--sidebar-ring", theme.sidebarRing);
    }
  }, []);
}
