"use client"

import { useState } from "react"
import { 
  Card,
  CardContent,
  CardHeader
} from "@/components/ui/card"
import { FolderIcon } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'

interface ProjectReportCardProps {
  number: string
  code: string
  markdownContent: string
}

export default function ProjectReportCard({
  number,
  code,
  markdownContent
}: ProjectReportCardProps) {
  return (
    <Card className="shadow-sm border">
      <CardHeader className="px-6 py-4 flex flex-row items-center">
        <div className="flex items-center text-amber-500 font-semibold gap-2 text-lg">
          <FolderIcon className="h-5 w-5" />
          <span>{number}. {code}</span>
        </div>
      </CardHeader>
      
      <CardContent className="px-6 pb-4">
        <div className="bg-gray-800 text-white p-4 rounded-md markdown-content">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm, remarkBreaks]}
          >
            {markdownContent}
          </ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  )
} 