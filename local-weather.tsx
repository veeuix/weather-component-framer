/**
 * Customizable Weather & Temperature created by @veeuix
 * v1.0.0
 * veeuix on 𝕏
 */

import * as React from "react"
import { ControlType, addPropertyControls } from "framer"
import { useState, useEffect } from "react"
import {
    fontStack,
    fontControls,
    fontSizeOptions,
    useFontControls,
} from "https://framer.com/m/framer/default-utils.js@^0.45.0"

export interface Props {
    style?: React.CSSProperties
    textColor?: string
    fontFamily?: string
    fontSize?: number
    lineHeight?: number
    fontStyle?: string
    latitude?: number
    longitude?: number
}

export const LocalWeatherAndTemperature: React.ComponentType<Props> =
    function LocalWeatherAndTemperature(props) {
        const {
            textColor,
            fontFamily,
            lineHeight,
            fontStyle,
            style,
            latitude,
            longitude,
        } = props
        const fontStyles = useFontControls(props)
        const [weatherInfo, setWeatherInfo] = useState<string | null>(null)

        useEffect(() => {
            fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=Asia/Jakarta`
            )
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok")
                    }
                    return response.json()
                })
                .then((data) => {
                    if (data && data.current_weather) {
                        const weatherCode = data.current_weather.weathercode
                        let weatherDescription = ""
                        switch (weatherCode) {
                            case 0:
                                weatherDescription = "Clear Sky"
                                break
                            case 1:
                            case 2:
                            case 3:
                                weatherDescription = "Partly Cloudy"
                                break
                            case 45:
                            case 48:
                                weatherDescription = "Fog"
                                break
                            case 51:
                            case 53:
                            case 55:
                                weatherDescription = "Drizzle"
                                break
                            case 61:
                            case 63:
                            case 65:
                                weatherDescription = "Rain"
                                break
                            case 71:
                            case 73:
                            case 75:
                                weatherDescription = "Snowfall"
                                break
                            case 95:
                                weatherDescription = "Thunderstorm"
                                break
                            default:
                                weatherDescription = ""
                                break
                        }
                        const temperature =
                            data.current_weather.temperature.toFixed(1) + "°C"
                        setWeatherInfo(
                            weatherDescription
                                ? `${weatherDescription}, ${temperature}`
                                : `${temperature}`
                        )
                    } else {
                        setWeatherInfo("Weather data not available")
                    }
                })
                .catch((error) => {
                    console.error("Error fetching the weather data:", error)
                    setWeatherInfo("Error fetching weather data")
                })
        }, [latitude, longitude])

        return (
            <div
                style={{
                    ...baseInputStyles,
                    color: textColor,
                    lineHeight: `${lineHeight}px`,
                    fontStyle: fontStyle,
                    textAlign: "left",
                    ...style,
                    width: "100%",
                    ...fontStyles,
                }}
            >
                {weatherInfo || "Loading..."}
            </div>
        )
    }

LocalWeatherAndTemperature.defaultProps = {
    textColor: "#E8E8E8",
    fontFamily: "Inter",
    fontSize: 16,
    fontWeight: 600,
    lineHeight: 20,
    fontStyle: "normal",
    latitude: -6.2088, // Default to Jakarta, Indonesia
    longitude: 106.8456,
}

addPropertyControls(LocalWeatherAndTemperature, {
    textColor: { type: ControlType.Color, title: "Color" },
    ...fontControls,
    fontSize: {
        ...(fontSizeOptions as any),
    },
    lineHeight: {
        type: ControlType.Number,
        min: 10,
        step: 1,
        max: 100,
        displayStepper: true,
        title: "Line Height (px)",
    },
    fontStyle: {
        type: ControlType.Enum,
        options: ["normal", "italic", "oblique"],
        title: "Font Style",
    },
    latitude: {
        type: ControlType.Number,
        title: "Latitude",
        defaultValue: -6.2088,
        step: 0.0001,
        displayStepper: true,
    },
    longitude: {
        type: ControlType.Number,
        title: "Longitude",
        defaultValue: 106.8456,
        step: 0.0001,
        displayStepper: true,
    },
} as any)

const baseInputStyles: React.CSSProperties = {
    fontFamily: fontStack,
}

LocalWeatherAndTemperature.displayName = "Local Weather and Temperature"


/**
 * [License](https://twitter.com/veeuix)
 */
