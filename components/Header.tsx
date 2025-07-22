import * as Location from "expo-location";
import { useRouter } from "expo-router";
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Sun,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions
} from "react-native";

export default function Header() {
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [currentTemp, setCurrentTemp] = useState<number | null>(null);
  const [dailyMin, setDailyMin] = useState<number | null>(null);
  const [dailyMax, setDailyMax] = useState<number | null>(null);
  const [weatherCode, setWeatherCode] = useState<number | null>(null);
  const router = useRouter();
  const { width } = useWindowDimensions();


  useEffect(() => {
    const now = new Date();
    setCurrentDate(
      now.toLocaleDateString("pl-PL", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
    setCurrentTime(now.toLocaleTimeString("pl-PL"));

    const timer = setInterval(() => {
      const tick = new Date();
      setCurrentTime(tick.toLocaleTimeString("pl-PL"));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.warn("Brak zgody na lokalizację.");
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        const url = new URL("https://api.open-meteo.com/v1/forecast");
        url.searchParams.set("latitude", latitude.toString());
        url.searchParams.set("longitude", longitude.toString());
        url.searchParams.set("current_weather", "true");
        url.searchParams.set(
          "daily",
          "apparent_temperature_min,apparent_temperature_max"
        );
        url.searchParams.set("timezone", "auto");

        const res = await fetch(url.toString());
        if (!res.ok) throw new Error("Błąd pobierania pogody");

        const json = await res.json();
        setCurrentTemp(json.current_weather.temperature);
        setWeatherCode(json.current_weather.weathercode);
        setDailyMin(Math.min(...json.daily.apparent_temperature_min));
        setDailyMax(Math.max(...json.daily.apparent_temperature_max));
      } catch (err) {
        console.error("Błąd lokalizacji lub pogody:", err);
      }
    })();
  }, []);

  const WeatherIcon = ({ code }: { code: number }) => {
    const props = { size: 24, color: "#1f2937" };
    if (code <= 1) return <Sun {...props} />;
    if (code === 2) return <CloudSun {...props} />;
    if (code <= 3) return <Cloud {...props} />;
    if (code <= 48) return <CloudFog {...props} />;
    if (code <= 67) return <CloudDrizzle {...props} />;
    if (code <= 77) return <CloudSnow {...props} />;
    if (code <= 82) return <CloudRain {...props} />;
    if (code <= 86) return <CloudSnow {...props} />;
    return <CloudLightning {...props} />;
  };

  return (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <View style={styles.dateTimeBox}>
        <Text style={styles.time}>{currentTime}</Text>
        <Text style={styles.date}>{currentDate}</Text>
      </View>
        {width >= 768 && (
        <Text style={styles.title}>Dzisiajv4</Text>
        )}

        <TouchableOpacity onPress={() => router.push("/settings")}>
          {currentTemp != null &&
            dailyMin != null &&
            dailyMax != null &&
            weatherCode != null && (
              <View style={styles.weatherBox}>
                <View style={styles.weatherRow}>
                  <WeatherIcon code={weatherCode} />
                  <Text style={styles.temp}>{currentTemp}°C</Text>
                </View>
                <Text style={styles.tempRange}>
                  min {dailyMin}° · max {dailyMax}°
                </Text>
              </View>
            )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    marginHorizontal:12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 5,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1f2937",
  },
  weatherBox: {
    alignItems: "flex-end",
  },
  dateTimeBox: {
    alignItems: "flex-start",
  },
  weatherRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  temp: {
    fontSize: 20,
    color: "#1f2937",
  },
  tempRange: {
    fontSize: 12,
    color: "#6b7280",
  },
  time: {
    fontSize: 22,
    fontWeight: "500",
    color: "#1f2937",
  },
  date: {
    fontSize: 12,
    color: "#6b7280",
  },
});
