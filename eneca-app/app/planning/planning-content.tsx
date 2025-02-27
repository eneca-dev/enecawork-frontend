"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const resources = ["АР", "КР", "ВК", "ОВ", "ЭС", "ЭОМ", "СС", "АК", "ТХ", "ПОС"]

interface CellValue {
  value: string
  resource: string
  date: string
}

export default function PlanningContent() {
  const [selectedProject, setSelectedProject] = useState("2")
  const [currentDate, setCurrentDate] = useState(new Date(2025, 1, 1))
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCell, setSelectedCell] = useState<{ resource: string; date: Date } | null>(null)
  const [cellValues, setCellValues] = useState<Record<string, CellValue>>({})
  const [currentValue, setCurrentValue] = useState("")

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const lastDay = new Date(year, month + 1, 0).getDate()
    return Array.from({ length: lastDay }, (_, i) => {
      const day = new Date(year, month, i + 1)
      return {
        date: day,
        dayName: new Intl.DateTimeFormat("ru", { weekday: "short" }).format(day),
        dayNumber: i + 1,
      }
    })
  }

  const days = getDaysInMonth(currentDate)

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleCellClick = (resource: string, date: Date) => {
    const key = `${resource}-${date.toISOString()}`
    setSelectedCell({ resource, date })
    setCurrentValue(cellValues[key]?.value || "")
    setIsDialogOpen(true)
  }

  const handleSaveValue = () => {
    if (selectedCell) {
      const key = `${selectedCell.resource}-${selectedCell.date.toISOString()}`
      if (currentValue) {
        setCellValues((prev) => ({
          ...prev,
          [key]: {
            value: currentValue,
            resource: selectedCell.resource,
            date: selectedCell.date.toISOString(),
          },
        }))
      } else {
        // Remove the value if empty
        const newValues = { ...cellValues }
        delete newValues[key]
        setCellValues(newValues)
      }
    }
    setIsDialogOpen(false)
    setCurrentValue("")
    setSelectedCell(null)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between p-4">
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Выберите проект">Проект {selectedProject}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Проект 1</SelectItem>
            <SelectItem value="2">Проект 2</SelectItem>
            <SelectItem value="3">Проект 3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="p-4 pb-0">
        <h1 className="text-2xl font-bold">Планирование ресурсов</h1>
        <p className="text-muted-foreground">Проект: Проект {selectedProject}</p>
      </div>

      <div className="flex items-center justify-between p-4">
        <Button variant="outline" size="sm" onClick={handlePrevMonth} className="gap-2">
          <ChevronLeft className="h-4 w-4" />
          Предыдущий месяц
        </Button>
        <h2 className="text-lg font-semibold">
          {currentDate.toLocaleString("ru", { month: "long", year: "numeric" })}
        </h2>
        <Button variant="outline" size="sm" onClick={handleNextMonth} className="gap-2">
          Следующий месяц
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 p-4 pt-0">
        <div className="border rounded-lg h-full">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted/50">
                <th className="border-r p-2 text-left sticky left-0 bg-muted/50 w-24">Разделы</th>
                {days.map(({ date, dayName, dayNumber }) => (
                  <th
                    key={dayNumber}
                    className={`border-r p-1 text-center ${
                      date.getDay() === 0 || date.getDay() === 6 ? "bg-muted" : ""
                    }`}
                    style={{ width: `calc((100% - 6rem) / ${days.length})` }}
                  >
                    <div className="text-xs text-muted-foreground">{dayName}</div>
                    <div className="text-sm">{dayNumber}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {resources.map((resource) => (
                <tr key={resource} className="border-t">
                  <td className="border-r p-2 font-medium sticky left-0 bg-background">{resource}</td>
                  {days.map(({ date }) => {
                    const key = `${resource}-${date.toISOString()}`
                    const hasValue = key in cellValues
                    return (
                      <td
                        key={date.toISOString()}
                        className={`border-r p-1 text-center ${
                          date.getDay() === 0 || date.getDay() === 6 ? "bg-muted/30" : ""
                        } hover:bg-muted/50 cursor-pointer ${hasValue ? "bg-emerald-100 dark:bg-emerald-900/30" : ""}`}
                        onClick={() => handleCellClick(resource, date)}
                      >
                        {cellValues[key]?.value || ""}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent aria-describedby="dialog-description">
          <DialogHeader>
            <DialogTitle>
              {selectedCell ? `${selectedCell.resource} - ${selectedCell.date.toLocaleDateString("ru")}` : ""}
            </DialogTitle>
            <DialogDescription id="dialog-description">
              Введите значение для выбранной ячейки. Оставьте поле пустым, чтобы удалить значение.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            placeholder="Введите значение"
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleSaveValue}>Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

