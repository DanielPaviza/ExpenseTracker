import { BuildOutline, Copy, RemoveCircleOutline } from '@vicons/ionicons5'

import { useI18n } from 'vue-i18n'

import { useSpendingDialogAction } from '@/composables/spending/useSpendingDialogAction'
import { useAppNavigation } from '@/composables/useAppNavigation'
import { type ActionContextItem } from '@/types/ActionContextItem'
import { Spending } from '@/types/Spending'
import { renderIcon } from '@/utils/iconUtils'

export function useSpendingDataTableAction() {
  const { t } = useI18n()
  const { deleteDialog } = useSpendingDialogAction()
  const { openEditSpending, openNewSpending } = useAppNavigation()

  const actionOptions: ActionContextItem[] = [
    {
      label: t('actions.delete'),
      key: 'deleteSpending',
      icon: renderIcon(RemoveCircleOutline, 'red'),
      handleSpendingAction: (spending: Spending): Promise<void> => deleteDialog(spending, null),
    },
    {
      label: t('actions.copy'),
      key: 'copySpending',
      icon: renderIcon(Copy, 'green'),
      handleSpendingAction: (spending: Spending): void => handleGotoCopyNewSpending(spending),
    },
    {
      label: t('actions.edit'),
      key: 'editSpending',
      icon: renderIcon(BuildOutline, 'orange'),
      handleSpendingAction: (spending: Spending): void => handleGotoEditSpending(spending),
    },
  ]

  const handleActionSelect = (actionKey: string, spending: Spending): void => {
    const selectedAction = actionOptions.find((option) => option.key === actionKey)
    if (!selectedAction) return
    selectedAction.handleSpendingAction!(spending)
  }

  function handleGotoEditSpending(spending: Spending): void {
    openEditSpending(spending.id)
  }

  function handleGotoCopyNewSpending(spending: Spending): void {
    openNewSpending(spending.id)
  }

  // Plain options for NDropdown (keeps template type inference shallow)
  const dropdownOptions = actionOptions.map(({ key, label, icon }) => ({ key, label, icon }))

  return {
    actionOptions,
    dropdownOptions,
    handleActionSelect,
  }
}
