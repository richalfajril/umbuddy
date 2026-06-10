import * as React from 'react'
import { AdminQuestionBankView } from './_components/admin-question-bank-view'
import type { AdminQuestionListResponse } from './_types/admin-question-bank.types'

export function AdminQuestionBankFlow({ initialData }: { initialData: AdminQuestionListResponse }) {
  return (
    <React.Fragment>
      <AdminQuestionBankView initialData={initialData} />
    </React.Fragment>
  )
}
