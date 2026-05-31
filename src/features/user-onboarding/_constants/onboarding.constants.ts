import type { ProfileForm } from '../_types/onboarding.types'

// Nilai awal form profile onboarding sebelum data user dari API dimuat.
export const initialProfile: ProfileForm = {
  target_instansi: '',
  target_score: '400',
  exam_date: '',
  province: '',
  city: '',
  institution: '',
  major: '',
  phone: '',
}
