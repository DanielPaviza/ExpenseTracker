import { invoke } from '@tauri-apps/api/core'

import { createSpending } from '@/composables/useSpending'
import { Spending } from '@/types/Spending'

const DEV_DB_PATH = './../src-tauri/expenseTrackerDb.json'

/**
 * Fetches spending data from a local JSON file.
 * This is used as a fallback when the invoke command fails.
 * @returns Array of Spending objects, or empty array if parsing fails
 */
async function fetchSpendingsFromFile(): Promise<Spending[]> {
  try {
    const response = await fetch(DEV_DB_PATH)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const jsonData = await response.text()
    return parseSpendings(jsonData)
  } catch (error) {
    console.error('Failed to load spendings via fetch:', error)
    return []
  }
}

/**
 * Loads spending data from the backend or falls back to a local JSON file.
 * @returns Array of Spending objects, or empty array if parsing fails
 */
export async function loadSpendings(): Promise<Spending[] | void> {
  try {
    const jsonData = await invoke<string>('load_data')
    return parseSpendings(jsonData)
  } catch (error) {
    console.error('Failed to load spendings via invoke, falling back to fetch:', error)
    // Fallback to fetching from local file in development mode
    if (import.meta.env.DEV) {
      return fetchSpendingsFromFile()
    }
  }
}

/**
 * Parses JSON string into an array of Spending objects
 * @param jsonData - JSON string containing spending data
 * @returns Array of Spending objects, or empty array if parsing fails
 */
export function parseSpendings(jsonData: string): Spending[] {
  try {
    const parsed = JSON.parse(jsonData)

    if (!Array.isArray(parsed)) {
      console.error('Parsed data is not an array')
      return []
    }

    const parsedSpendings = parsed.map((item: Spending) => createSpending(item))
    return parsedSpendings
  } catch (error) {
    console.error('Failed to parse spendings:', error)
    return []
  }
}

/**
 * Saves spending data to the backend
 * @param spendings - Array of Spending objects to save
 * @returns Promise that resolves when save is complete
 */
export async function saveSpendings(spendings: Spending[]): Promise<void> {
  try {
    const jsonData = JSON.stringify(spendings)
    await invoke('save_data', { jsonData })
  } catch (error) {
    console.error('Failed to save spendings:', error)
    throw error
  }
}
