export interface BulkEditProps {
  name: string
  canSelectScope: boolean
  title: string
  nameLabel: string
  deleteDialogTitle: string
  deleteDialogContentText: string
  deleteDialogSuccessMessage: string
  renameSuccessText: string
  renameErrorText: string
  nameInputTooltip: string
  removeSpendingBulk: (isAllCategories: boolean) => void
  renameSpendingProperty: (newName: string, isAllCategories: boolean) => void
}
