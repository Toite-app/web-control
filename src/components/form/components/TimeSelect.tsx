import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo } from "react";

interface TimeSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const TimeSelect = ({
  value = "00:00",
  onChange,
  disabled,
}: TimeSelectProps) => {
  // Move value parsing into useMemo
  const { currentHour, currentMinute } = useMemo(() => {
    const [hour = "00", minute = "00"] = value?.split(":") ?? [];
    return {
      currentHour: parseInt(hour) || 0,
      currentMinute: parseInt(minute) || 0,
    };
  }, [value]);

  // Move hours and minutes arrays into useMemo
  const { hours, minutes } = useMemo(
    () => ({
      hours: Array.from({ length: 24 }, (_, i) =>
        i.toString().padStart(2, "0")
      ),
      minutes: Array.from({ length: 60 }, (_, i) =>
        i.toString().padStart(2, "0")
      ),
    }),
    []
  );

  const handleHourChange = (hour: string) => {
    const minute = currentMinute.toString().padStart(2, "0");
    onChange(`${hour}:${minute}`);
  };

  const handleMinuteChange = (minute: string) => {
    const hour = currentHour.toString().padStart(2, "0");
    onChange(`${hour}:${minute}`);
  };

  return (
    <div className="flex w-full gap-2">
      <Select
        value={currentHour.toString().padStart(2, "0")}
        onValueChange={handleHourChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue
          // placeholder={hourLabel ? t(hourLabel) : t("time-select.hour")}
          />
        </SelectTrigger>
        <SelectContent>
          {hours.map((hour) => (
            <SelectItem key={hour} value={hour}>
              {hour}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={currentMinute.toString().padStart(2, "0")}
        onValueChange={handleMinuteChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue
          // placeholder={minuteLabel ? t(minuteLabel) : t("time-select.minute")}
          />
        </SelectTrigger>
        <SelectContent>
          {minutes.map((minute) => (
            <SelectItem key={minute} value={minute}>
              {minute}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
