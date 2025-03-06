"use client"

import { useState, useEffect, useMemo } from "react"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import Calendar from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import ProjectReportCard from "./project-report-card"
import { CalendarIcon, Download, MoreVertical, Moon, Sun } from "lucide-react"
import { API_URL } from "@/lib/config"

// Компонент для отображения ошибки дайджеста
function DigestErrorMessage({ message }: { message: string | null }) {
  if (!message) return null;
  
  return (
    <div className="p-4 my-4 bg-yellow-100 text-yellow-800 rounded-md">
      {message}
    </div>
  );
}

// Интерфейс для данных проекта
interface Project {
  project_id: string;
  project_name: string;
  project_manager: string;
  project_manager_email: string;
}

// Интерфейс для данных из markdown
interface DigestData {
  digest_text: string;
}

// Интерфейс для ошибки от API
interface ApiError {
  detail: string;
}

// Интерфейс для отдела, извлеченного из markdown
interface Department {
  id: string;
  name: string;
}

// Интерфейс для задачи отдела
interface DepartmentTask {
  name: string;
  yesterdayTime: string;
  yesterdayAmount: number;
  assignee: string;
  deadline: string;
  work: string[];
  comments: string[];
}

// Интерфейс для структурированных данных отдела
interface DepartmentData {
  code: string;
  name: string;
  yesterdayAmount: number;
  percentChange: number;
  timeChart: Record<string, string>;
  tasks: DepartmentTask[];
  actualAmount?: number;
  totalAmount?: number;
  percentComplete?: number;
}

export default function DigestContent() {
  // Создаем вчерашнюю дату
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  const [date, setDate] = useState<Date>(yesterday)
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<string>("")
  const [selectedManager, setSelectedManager] = useState<string>("")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("")
  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [digestError, setDigestError] = useState<string | null>(null)
  const [digestMarkdown, setDigestMarkdown] = useState<string>("")
  const [parsedDepartmentData, setParsedDepartmentData] = useState<Record<string, DepartmentData>>({});
  
  // Получаем уникальных менеджеров из списка проектов (исправление ошибки линтера)
  const managers = useMemo(() => {
    const uniqueManagers: { name: string; email: string }[] = [];
    const seenManagers = new Set<string>();
    
    projects.forEach(project => {
      if (!seenManagers.has(project.project_manager)) {
        seenManagers.add(project.project_manager);
        uniqueManagers.push({
          name: project.project_manager,
          email: project.project_manager_email
        });
      }
    });
    
    return uniqueManagers;
  }, [projects]);
  
  // Фильтруем проекты по выбранному менеджеру
  const filteredProjects = useMemo(() => {
    if (!selectedManager) {
      return projects; // Если менеджер не выбран, показываем все проекты
    }
    
    return projects.filter(project => 
      project.project_manager === selectedManager
    );
  }, [projects, selectedManager]);
  
  // При изменении менеджера сбрасываем выбранный проект, если он больше не в списке
  useEffect(() => {
    if (selectedManager && selectedProject) {
      const projectExists = filteredProjects.some(
        project => project.project_id === selectedProject
      );
      
      if (!projectExists) {
        setSelectedProject("");
        setSelectedDepartment("");
        setDepartments([]);
        setDigestMarkdown("");
      }
    }
  }, [selectedManager, selectedProject, filteredProjects]);
  
  // Обработчик изменения менеджера
  const handleManagerChange = (value: string) => {
    setSelectedManager(value);
    setSelectedDepartment("");
    setDepartments([]);
    setDigestMarkdown("");
  };
  
  // Обработчик изменения проекта
  const handleProjectChange = (value: string) => {
    setSelectedProject(value);
    setSelectedDepartment("");
    // Загружаем данные markdown при выборе проекта
    fetchDigestMarkdown(value);
  };
  
  // Обработчик изменения даты
  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      // Если уже выбран проект, обновляем markdown с новой датой
      if (selectedProject) {
        fetchDigestMarkdown(selectedProject, newDate);
      }
    }
  };
  
  // Функция для парсинга markdown и извлечения отделов
  const extractDepartmentsFromMarkdown = (markdown: string): Department[] => {
    if (!markdown) return [];
    
    const departments: Department[] = [];
    const lines = markdown.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Поддержка разных форматов заголовков отделов (с emoji и без)
      if (line.startsWith('# 📂')) {
        const match = line.match(/# 📂 ([А-ЯA-Z0-9]+) .+/);
        if (match && match[1]) {
          departments.push({
            id: match[1],
            name: match[1]
          });
        }
      } else if (line.startsWith('# ') && line.includes('/')) {
        const match = line.match(/# ([А-ЯA-Z0-9]+) .+/);
        if (match && match[1]) {
          departments.push({
            id: match[1],
            name: match[1]
          });
        }
      }
    }
    
    return departments;
  };
  
  // Функция для извлечения данных отдела из markdown
  const extractDepartmentDataFromMarkdown = (markdown: string): Record<string, DepartmentData> => {
    if (!markdown) return {};
    
    const departmentData: Record<string, DepartmentData> = {};
    const lines = markdown.split('\n');
    
    let currentDepartment: string | null = null;
    let currentTask: string | null = null;
    let departmentInfo: Partial<DepartmentData> = {};
    let taskInfo: Partial<DepartmentTask> = {};
    
    let isInWorkSection = false;
    let isInCommentsSection = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Заголовок первого уровня - это отдел (ищем как с emoji, так и без)
      if (line.startsWith('# 📂') || (line.startsWith('# ') && line.includes('/'))) {
        // Если был предыдущий отдел, сохраняем его данные
        if (currentDepartment && departmentInfo) {
          if (taskInfo.name) {
            departmentInfo.tasks = [...(departmentInfo.tasks || []), taskInfo as DepartmentTask];
          }
          departmentData[currentDepartment] = departmentInfo as DepartmentData;
        }
        
        // Начинаем новый отдел
        // Пробуем разные форматы заголовка (с emoji и без)
        let departmentCode: string;
        let departmentName: string;
        
        if (line.startsWith('# 📂')) {
          const match = line.match(/# 📂 ([А-ЯA-Z0-9]+) (.+)/);
          if (match) {
            departmentName = match[1];
            departmentCode = match[2].trim();
            currentDepartment = departmentName;
          } else {
            continue;
          }
        } else {
          // Формат без emoji: "# ЭС 27/24-С"
          const match = line.match(/# ([А-ЯA-Z0-9]+) ([0-9/]+\-[А-ЯA-Z]+)/);
          if (match) {
            departmentName = match[1];
            departmentCode = match[0].replace('# ', '');
            currentDepartment = departmentName;
          } else {
            continue;
          }
        }
        
        departmentInfo = {
          code: departmentCode,
          name: departmentName,
          yesterdayAmount: 0,
          percentChange: 0,
          timeChart: {},
          tasks: [],
          actualAmount: 0,
          totalAmount: 0,
          percentComplete: 0
        };
        
        // Сбрасываем текущую задачу
        currentTask = null;
        taskInfo = {};
        isInWorkSection = false;
        isInCommentsSection = false;
        
        continue;
      }
      
      // Если не определен отдел, пропускаем строку
      if (!currentDepartment) continue;
      
      // Парсинг информации об отделе - внесено за вчера
      if (line.startsWith('**Внесено за вчера:**')) {
        const match = line.match(/\*\*Внесено за вчера:\*\* ([0-9.]+) BYN/);
        if (match) {
          departmentInfo.yesterdayAmount = parseFloat(match[1]);
        }
        continue;
      }
      
      // Парсинг процентного изменения
      if (line.includes('**+') && line.includes('%**')) {
        const percentMatch = line.match(/\*\*\+([0-9.]+)%\*\*/);
        if (percentMatch) {
          departmentInfo.percentChange = parseFloat(percentMatch[1]);
        }
        continue;
      }
      
      // Парсинг графика трудозатрат
      if (line === '**График трудозатрат**') {
        let j = i + 1;
        while (j < lines.length && !lines[j].trim().startsWith('#') && j < i + 10) {
          const dateMatch = lines[j].match(/([0-9]{2}\.[0-9]{2}):/);
          if (dateMatch) {
            const date = dateMatch[1];
            // Извлекаем возможное время, если есть
            const timeMatch = lines[j].match(/\(([0-9:]+)\)/);
            departmentInfo.timeChart = {
              ...(departmentInfo.timeChart || {}),
              [date]: timeMatch ? timeMatch[1] : ''
            };
          }
          j++;
        }
        continue;
      }
      
      // Заголовок второго уровня - это задача отдела
      // Формат "## {Входящие задания} ЭС 27/24-С - за вчера 28:00 = 494.20 BYN"
      // или "## {Разработка схем автоматизации} - за вчера 4:00 = 94.16 BYN"
      if (line.startsWith('## {') || line.startsWith('##')) {
        // Если была предыдущая задача, сохраняем ее
        if (taskInfo.name) {
          departmentInfo.tasks = [...(departmentInfo.tasks || []), taskInfo as DepartmentTask];
        }
        
        // Обработка разных форматов строки задачи
        let match;
        if (line.startsWith('## {')) {
          match = line.match(/## \{(.+?)\}.*?за вчера ([0-9:]+) = ([0-9.]+) BYN/);
        } else {
          match = line.match(/## (.+?) - за вчера ([0-9:]+) = ([0-9.]+) BYN/);
        }
        
        if (match) {
          currentTask = match[1];
          taskInfo = {
            name: match[1],
            yesterdayTime: match[2],
            yesterdayAmount: parseFloat(match[3]),
            assignee: '',
            deadline: '',
            work: [],
            comments: []
          };
          isInWorkSection = false;
          isInCommentsSection = false;
        }
        continue;
      }
      
      // Если задача не определена, пропускаем строку
      if (!currentTask) continue;
      
      // Парсинг информации о сотруднике
      if (line.startsWith('Отчитались:')) {
        const match = line.match(/Отчитались: (.+)/);
        if (match) {
          taskInfo.assignee = match[1].trim();
        }
        continue;
      }
      
      // Парсинг информации о важных моментах/выполненной работе
      if (line === '**Выполненная работа**:' || line === '**Важные моменты**:') {
        isInWorkSection = true;
        isInCommentsSection = false;
        continue;
      }
      
      // Секция "Комментарии"
      if (line === '**Комментарии**:') {
        isInWorkSection = false;
        isInCommentsSection = true;
        continue;
      }
      
      // Добавление элементов в соответствующие секции
      if (line.startsWith('- ')) {
        const content = line.substring(2).trim();
        if (isInWorkSection) {
          taskInfo.work = [...(taskInfo.work || []), content];
        } else if (isInCommentsSection) {
          taskInfo.comments = [...(taskInfo.comments || []), content];
        }
      }
      
      // Если встретили разделитель "---", это конец задачи или отдела
      if (line === '---') {
        if (taskInfo.name) {
          departmentInfo.tasks = [...(departmentInfo.tasks || []), taskInfo as DepartmentTask];
          taskInfo = {};
          currentTask = null;
        }
      }
    }
    
    // Добавляем последнюю задачу и отдел, если они есть
    if (currentDepartment && departmentInfo) {
      if (taskInfo.name && Object.keys(taskInfo).length > 0) {
        departmentInfo.tasks = [...(departmentInfo.tasks || []), taskInfo as DepartmentTask];
      }
      departmentData[currentDepartment] = departmentInfo as DepartmentData;
    }
    
    return departmentData;
  };
  
  // Обновление функции fetchDigestMarkdown для парсинга данных отделов
  const fetchDigestMarkdown = async (projectId: string, selectedDate: Date = date) => {
    if (!projectId) return;
    
    try {
      setIsLoading(true);
      setDigestError(null); // Сбрасываем предыдущую ошибку дайджеста
      
      // Форматируем дату в формат YYYY-MM-DD
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      // Запрос на получение markdown
      const response = await fetch(`${API_URL}/api/digest/markdown/${projectId}?digest_date=${formattedDate}`);
      // Получаем JSON-ответ, даже если статус ошибочный
      const data = await response.json();
      
      if (!response.ok) {
        // Если статус 404 и есть поле detail - это ожидаемая ошибка "Дайджест не найден"
        if (response.status === 404 && 'detail' in data) {
          const apiError = data as ApiError;
          setDigestError(apiError.detail);
          setDigestMarkdown("");
          setDepartments([]);
          setParsedDepartmentData({});
          setSelectedDepartment("");
          return;
        } else {
          // Иные ошибки, которые не ожидаются
          throw new Error(`Ошибка загрузки данных: ${response.status}`);
        }
      }
      
      // Если всё хорошо, обрабатываем данные как обычно
      const digestData = data as DigestData;
      
      // Сохраняем markdown
      setDigestMarkdown(digestData.digest_text);
      
      // Извлекаем отделы из markdown
      const extractedDepartments = extractDepartmentsFromMarkdown(digestData.digest_text);
      setDepartments(extractedDepartments);
      
      // Парсим данные отделов
      const parsedData = extractDepartmentDataFromMarkdown(digestData.digest_text);
      setParsedDepartmentData(parsedData);
      
      // Сбрасываем выбранный отдел
      setSelectedDepartment("");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      console.error('Ошибка при загрузке markdown:', err);
      setDigestMarkdown("");
      setDepartments([]);
      setParsedDepartmentData({});
      setSelectedDepartment("");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Загрузка данных при монтировании компонента
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        
        // Проверяем, есть ли данные в Session Storage
        const storedData = sessionStorage.getItem('digestProjects');
        
        if (storedData) {
          // Используем данные из Session Storage
          const parsedData = JSON.parse(storedData);
          setProjects(parsedData);
          setIsLoading(false);
          return;
        }
        
        // Если данных нет, делаем запрос на бэкенд
        const response = await fetch(`${API_URL}/api/digest/projects`);
        
        if (!response.ok) {
          throw new Error(`Ошибка загрузки данных: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Сохраняем данные в Session Storage
        sessionStorage.setItem('digestProjects', JSON.stringify(data));
        
        // Обновляем состояние
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
        console.error('Ошибка при загрузке проектов:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  // Автоматически загружать данные дайджеста при изменении проекта или даты
  useEffect(() => {
    if (selectedProject) {
      fetchDigestMarkdown(selectedProject, date);
    }
  }, [selectedProject, date]);
  
  // Функция для получения markdown-контента для конкретного отдела
  const getDepartmentMarkdown = (markdown: string, departmentId: string): string => {
    if (!markdown || !departmentId) return '';
    
    const lines = markdown.split('\n');
    let result = '';
    let isInDepartment = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Проверка начала раздела отдела
      if (line.startsWith('# ')) {
        // Проверяем, соответствует ли этот заголовок нужному отделу
        const match = line.match(/# (?:📂 )?([А-ЯA-Z0-9]+)/);
        
        if (match && match[1] === departmentId) {
          isInDepartment = true;
          result = line + '\n'; // Начинаем собирать контент с заголовка
          continue;
        } else if (isInDepartment) {
          // Если мы уже собирали контент для нужного отдела и встретили
          // новый заголовок первого уровня, значит, раздел отдела закончился
          break;
        }
      }
      
      if (isInDepartment) {
        result += line + '\n';
      }
    }
    
    return result;
  };
  
  return (
    <div className="container py-6 mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Отчёты по проекту</h1>
      
      {error && (
        <div className="p-4 bg-red-100 text-red-800 rounded-md">
          {error}
        </div>
      )}
      
      {/* Сообщение о том, что дайджест не найден */}
      {digestError && (
        <div className="p-4 bg-yellow-100 text-yellow-800 rounded-md">
          {digestError}
        </div>
      )}
      
      {/* Фильтры */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-3">
          <Select value={selectedManager} onValueChange={handleManagerChange}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Менеджер" />
            </SelectTrigger>
            <SelectContent>
              {isLoading ? (
                <SelectItem value="loading" disabled>Загрузка...</SelectItem>
              ) : (
                managers.map(manager => (
                  <SelectItem key={manager.email} value={manager.name}>
                    {manager.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          
          <Select value={selectedProject} onValueChange={handleProjectChange}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Выберите проект" />
            </SelectTrigger>
            <SelectContent>
              {isLoading ? (
                <SelectItem value="loading" disabled>Загрузка...</SelectItem>
              ) : (
                filteredProjects.map(project => (
                  <SelectItem key={project.project_id} value={project.project_id}>
                    {project.project_name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment} disabled={departments.length === 0}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Выберите отдел" />
            </SelectTrigger>
            <SelectContent>
              {departments.length === 0 ? (
                <SelectItem value="no-data" disabled>Нет данных</SelectItem>
              ) : (
                departments.map(dept => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[220px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'd MMMM yyyy г.', { locale: ru }) : <span>Выберите дату</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <div className="p-2">
                <Calendar selected={date} onSelect={handleDateChange} />
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Moon className="h-4 w-4 dark:hidden" />
            <Sun className="h-4 w-4 hidden dark:block" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Отображение ошибки дайджеста */}
      <DigestErrorMessage message={digestError} />
      
      {/* Карточки отчетов */}
      <div className="space-y-4">
        {selectedDepartment && parsedDepartmentData[selectedDepartment] ? (
          <ProjectReportCard
            number={parsedDepartmentData[selectedDepartment].name}
            code={parsedDepartmentData[selectedDepartment].code}
            markdownContent={getDepartmentMarkdown(digestMarkdown, selectedDepartment)}
          />
        ) : !selectedDepartment && !digestError ? (
          <div className="p-6 text-center bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500">Выберите отдел для просмотра данных</p>
          </div>
        ) : null}
      </div>
    </div>
  )
} 