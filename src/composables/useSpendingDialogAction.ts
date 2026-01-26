import { useSpendingsStore } from '@stores/spendingsStore'
import { useDialog, useMessage } from 'naive-ui'

import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function useSpendingDialogAction() {
  const { t } = useI18n()
  const dialog = useDialog()
  const message = useMessage()
  const store = useSpendingsStore()

  const deleteDialog = async (
    data: { name: string; id: string },
    event: Event | null,
    onPositiveAction?: () => void,
  ): Promise<void> => {
    event?.stopPropagation()

    dialog.warning({
      title: t('dialogs.deletePurchaseTitle'),
      content: t('dialogs.deletePurchaseContent', { name: data.name }),
      positiveText: t('dialogs.delete'),
      negativeText: t('common.cancel'),
      onPositiveClick: async () => {
        await store.removeSpending(data.id)
        message.success(t('messages.purchaseDeletedSuccessfully'))
        onPositiveAction?.()
      },
    })
  }

  const discardChangesDialog = (): void => {
    dialog.warning({
      title: t('dialogs.discardChangesTitle'),
      content: t('dialogs.discardChangesContent'),
      positiveText: t('dialogs.discard'),
      negativeText: t('common.cancel'),
      onPositiveClick: () => {
        store.discardChanges()
        message.info(t('messages.changesDiscarded'))
      },
    })
  }

  const restoreAllChangesDialog = (totalCount: number): void => {
    dialog.warning({
      title: t('dialogs.restoreAllTitle'),
      content: t('dialogs.restoreAllContent', { count: totalCount }),
      positiveText: t('dialogs.restore'),
      negativeText: t('common.cancel'),
      onPositiveClick: async () => {
        try {
          await store.restoreAllDeletedSpendings()
          message.success(t('messages.allDeletedItemsRestored'))
        } catch {
          message.error(t('messages.errorRestoringAllItems'))
        }
      },
    })
  }

  return {
    deleteDialog,
    discardChangesDialog,
    restoreAllChangesDialog,
  }
}
