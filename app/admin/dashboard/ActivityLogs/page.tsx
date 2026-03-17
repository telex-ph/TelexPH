'use client'

import React from 'react'
import ActivityLogs from './components/ActivityLogs'

// No need to receive isdarkmode prop anymore - ActivityLogs uses Context
export default function ActivityLogsPage() {
  return (
    <div className="w-full">
      <ActivityLogs />
    </div>
  )
}