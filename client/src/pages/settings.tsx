import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";

interface ColorTheme {
  id: string;
  name: string;
  description: string;
  primaryColor: string;
  colors: {
    primary: string;
    ring: string;
    sidebarPrimary: string;
    sidebarRing: string;
  };
}

const colorThemes: ColorTheme[] = [
  {
    id: "blue",
    name: "Professional Blue",
    description: "Classic blue theme for business applications",
    primaryColor: "rgb(59, 130, 246)",
    colors: {
      primary: "217 91% 60%",
      ring: "217 91% 60%",
      sidebarPrimary: "217 91% 60%",
      sidebarRing: "217 91% 60%",
    },
  },
  {
    id: "purple",
    name: "Creative Purple",
    description: "Modern purple for innovative teams",
    primaryColor: "rgb(168, 85, 247)",
    colors: {
      primary: "271 91% 65%",
      ring: "271 91% 65%",
      sidebarPrimary: "271 91% 65%",
      sidebarRing: "271 91% 65%",
    },
  },
  {
    id: "green",
    name: "Success Green",
    description: "Fresh green for growth-focused organizations",
    primaryColor: "rgb(34, 197, 94)",
    colors: {
      primary: "142 76% 45%",
      ring: "142 76% 45%",
      sidebarPrimary: "142 76% 45%",
      sidebarRing: "142 76% 45%",
    },
  },
  {
    id: "orange",
    name: "Energy Orange",
    description: "Vibrant orange for dynamic environments",
    primaryColor: "rgb(249, 115, 22)",
    colors: {
      primary: "25 95% 53%",
      ring: "25 95% 53%",
      sidebarPrimary: "25 95% 53%",
      sidebarRing: "25 95% 53%",
    },
  },
  {
    id: "rose",
    name: "Elegant Rose",
    description: "Sophisticated rose for premium services",
    primaryColor: "rgb(244, 63, 94)",
    colors: {
      primary: "351 95% 71%",
      ring: "351 95% 71%",
      sidebarPrimary: "351 95% 71%",
      sidebarRing: "351 95% 71%",
    },
  },
  {
    id: "teal",
    name: "Balanced Teal",
    description: "Calming teal for focused productivity",
    primaryColor: "rgb(20, 184, 166)",
    colors: {
      primary: "173 80% 40%",
      ring: "173 80% 40%",
      sidebarPrimary: "173 80% 40%",
      sidebarRing: "173 80% 40%",
    },
  },
];

export default function Settings() {
  const [selectedTheme, setSelectedTheme] = useState<string>("blue");

  useEffect(() => {
    const savedTheme = localStorage.getItem("color-theme");
    if (savedTheme) {
      setSelectedTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (themeId: string) => {
    const theme = colorThemes.find((t) => t.id === themeId);
    if (!theme) return;

    const root = document.documentElement;
    root.style.setProperty("--primary", theme.colors.primary);
    root.style.setProperty("--ring", theme.colors.ring);
    root.style.setProperty("--sidebar-primary", theme.colors.sidebarPrimary);
    root.style.setProperty("--sidebar-ring", theme.colors.sidebarRing);
  };

  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
    applyTheme(themeId);
    localStorage.setItem("color-theme", themeId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Customize your application appearance and preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Color Theme</CardTitle>
          <CardDescription>
            Choose a color scheme that matches your style and brand
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedTheme} onValueChange={handleThemeChange}>
            <div className="grid gap-4 md:grid-cols-2">
              {colorThemes.map((theme) => (
                <div
                  key={theme.id}
                  className={`relative flex items-start space-x-3 rounded-md border-2 p-4 cursor-pointer transition-all hover-elevate ${
                    selectedTheme === theme.id
                      ? "border-primary"
                      : "border-border"
                  }`}
                  onClick={() => handleThemeChange(theme.id)}
                  data-testid={`theme-option-${theme.id}`}
                >
                  <RadioGroupItem
                    value={theme.id}
                    id={theme.id}
                    className="mt-0.5"
                    data-testid={`radio-${theme.id}`}
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full border-2 border-background shadow-sm"
                        style={{ backgroundColor: theme.primaryColor }}
                      />
                      <Label
                        htmlFor={theme.id}
                        className="font-medium cursor-pointer"
                      >
                        {theme.name}
                      </Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {theme.description}
                    </p>
                  </div>
                  {selectedTheme === theme.id && (
                    <Check className="absolute top-4 right-4 h-5 w-5 text-primary" data-testid={`check-${theme.id}`} />
                  )}
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
}
