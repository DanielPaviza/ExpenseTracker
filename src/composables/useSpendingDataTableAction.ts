import { BuildOutline, Copy, RemoveCircleOutline } from '@vicons/ionicons5'
import { NIcon } from 'naive-ui'

import { Component, VNode, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import { useSpendingDialogAction } from '@/composables/useSpendingDialogAction'
import { Spending } from '@/types/Spending'
import { SpendingAction } from '@/types/SpendingAction'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function useSpendingDataTableAction() {
  const { t } = useI18n()
  const { deleteDialog } = useSpendingDialogAction()
  const router = useRouter()

  const actionOptions: SpendingAction[] = [
    {
      label: t('actions.delete'),
      key: 'deleteSpending',
      icon: renderIcon(RemoveCircleOutline, 'red'),
      handleAction: (spending: Spending): Promise<void> => deleteDialog(spending, null),
    },
    {
      label: t('actions.copy'),
      key: 'copySpending',
      icon: renderIcon(Copy, 'green'),
      handleAction: (spending: Spending): void => handleGotoCopyNewSpending(spending),
    },
    {
      label: t('actions.edit'),
      key: 'editSpending',
      icon: renderIcon(BuildOutline, 'orange'),
      handleAction: (spending: Spending): void => handleGotoEditSpending(spending),
    },
  ]

  const handleActionSelect = (actionKey: string, spending: Spending): void => {
    const selectedAction = actionOptions.find((option) => option.key === actionKey)
    if (!selectedAction) return
    selectedAction.handleAction(spending)
  }

  function handleGotoEditSpending(spending: Spending): void {
    router.push(`/edit/${spending.id}`)
  }

  function handleGotoCopyNewSpending(spending: Spending): void {
    router.push({ path: '/new', query: { template: spending.id } })
  }

  function renderIcon(icon: Component, color: string) {
    return (): VNode => {
      return h(
        NIcon,
        { color },
        {
          default: () => h(icon),
        },
      )
    }
  }

  return {
    actionOptions,
    handleActionSelect,
  }
}
