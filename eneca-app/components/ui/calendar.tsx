"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CalendarProps {
  selected?: Date | null
  onSelect?: (date: Date | undefined) => void
}

export default function Calendar({ selected, onSelect }: CalendarProps = {}) {
  // Инициализируем текущую дату на основе выбранной даты, если она предоставлена
  const [currentDate, setCurrentDate] = useState(selected || new Date())
  const [internalSelectedDate, setInternalSelectedDate] = useState<Date | null>(selected || null)
  
  // Get actual selected date from props or internal state
  const selectedDate = selected !== undefined ? selected : internalSelectedDate
  
  // Обновляем текущий месяц при изменении selected
  useEffect(() => {
    if (selected) {
      setCurrentDate(selected);
    }
  }, [selected]);

  // Get current month and year
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // Get days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

  // Month names in Russian
  const monthNames = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ]

  // Day names in Russian
  const dayNames = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"]

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  }

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
  }

  // Check if a date is today
  const isToday = (day: number) => {
    const today = new Date()
    return day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()
  }

  // Check if a date is selected
  const isSelected = (day: number) => {
    return (
      selectedDate?.getDate() === day &&
      selectedDate?.getMonth() === currentMonth &&
      selectedDate?.getFullYear() === currentYear
    )
  }

  // Handle date selection
  const handleDateClick = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day)
    
    // Update internal state if no external state is provided
    if (selected === undefined) {
      setInternalSelectedDate(newDate)
    }
    
    // Call onSelect prop if provided
    if (onSelect) {
      onSelect(newDate)
    }
  }

  // Generate calendar days
  const renderCalendarDays = () => {
    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10" />)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <div key={day} className="flex items-center justify-center">
          <button
            onClick={() => handleDateClick(day)}
            className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors 
              ${isToday(day) ? "bg-primary text-primary-foreground" : ""}
              ${isSelected(day) && !isToday(day) ? "bg-secondary text-secondary-foreground" : ""} 
              ${!isToday(day) && !isSelected(day) ? "hover:bg-muted" : ""}
            `}
          >
            {day}
          </button>
        </div>,
      )
    }

    return days
  }

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <CardTitle>
            {monthNames[currentMonth]} {currentYear}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {dayNames.map((day) => (
            <div key={day} className="text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>
        {selectedDate && (
          <div className="mt-4 text-center text-sm">Выбранная дата: {selectedDate.toLocaleDateString("ru-RU")}</div>
        )}
      </CardContent>
    </Card>
  )
} 