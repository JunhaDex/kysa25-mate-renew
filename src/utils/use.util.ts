import type { KeyMapping } from '@/types/common.type.ts'
import dayjs from 'dayjs'

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function cleanObj<T extends object>(obj: Record<string, any>, mapping: KeyMapping): T {
  const result: Record<string, any> = {}
  for (const sourceKey in mapping) {
    const targetKey = mapping[sourceKey]
    result[targetKey] = null
  }
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const keyMap = mapping[key]
      if (keyMap) {
        result[keyMap] = obj[key]
      }
    }
  }
  return result as T
}

export function timeToStr(time: string): string {
  const now = dayjs()
  const target = dayjs(time)
  const seconds = now.diff(target, 'second')
  const minutes = now.diff(target, 'minute')
  const hours = now.diff(target, 'hour')
  const days = now.diff(target, 'day')
  const weeks = now.diff(target, 'week')
  const months = now.diff(target, 'month')
  const years = now.diff(target, 'year')
  const formatUnit = (time: number, unit: string) => {
    const preventNegative = time < 0 ? 0 : time
    return `${preventNegative}${unit} 전`
  }
  if (seconds < 60) {
    return formatUnit(seconds, '초')
  } else if (minutes < 60) {
    return formatUnit(minutes, '분')
  } else if (hours < 24) {
    return formatUnit(hours, '시간')
  } else if (days < 7) {
    return formatUnit(days, '일')
  } else if (weeks <= 4) {
    return formatUnit(weeks, '주')
  } else if (months <= 12) {
    return formatUnit(months, '개월')
  } else {
    return formatUnit(years, '년')
  }
}
