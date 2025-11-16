import { invoke } from '@tauri-apps/api/core'
import { Spending } from '@models/Spending'

/**
 * Loads spending data from the backend
 * @returns Array of Spending objects, or empty array if parsing fails
 */
export async function loadSpendings(): Promise<Spending[]> {
  try {
    const jsonData = await invoke<string>('load_data')
    return parseSpendings(jsonData)
  } catch (error) {
    console.error('Failed to load spendings:', error)
    return []
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

    return parsed.map((item: any) => new Spending(item))
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
