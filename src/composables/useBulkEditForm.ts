import { useI18n } from 'vue-i18n'

import { BulkEdit } from '@/constants/bulkEdit'
import { useSpendingsStore } from '@/stores/spendingsStore'
import { BulkEditProps } from '@/types/BulkEditProps'

export function useBulkEditForm() {
  const { t } = useI18n()
  const {
    categoryView,
    removeSpendingCategory,
    renameSpendingCategory,
    removeSpendingSubCategory,
    renameSpendingSubCategory,
    removeSpendingStore,
    renameSpendingStore,
    removeSpendingTag,
    renameSpendingTag,
  } = useSpendingsStore()

  const getBulkEditFormProps = (type: BulkEdit, name: string): BulkEditProps => {
    switch (type) {
      case BulkEdit.category:
        return getCategoryFormProps(name)
      case BulkEdit.subCategory:
        return getSubCategoryFormProps(name)
      case BulkEdit.store:
        return getStoreFormProps(name)
      case BulkEdit.tag:
        return getTagFormProps(name)
      default:
        throw new Error(`Unsupported bulk edit type: ${type}`)
    }
  }

  const getCategoryFormProps = (name: string): BulkEditProps => {
    return {
      name: name,
      canSelectScope: false,
      title: t('spendingBulkEditForm.categoryTitle'),
      nameLabel: t('spendingBulkEditForm.categoryName'),
      deleteDialogTitle: t('dialogs.deleteCategoryTitle'),
      deleteDialogContentText: t('dialogs.deleteCategoryContent', { name }),
      deleteDialogSuccessMessage: t('dialogs.deleteCategorySuccess', { name }),
      renameSuccessText: t('spendingBulkEditForm.categoryNameChangeSuccess', {
        oldName: name,
      }),
      renameErrorText: t('spendingBulkEditForm.categoryNameChangeError', {
        name,
      }),
      nameInputTooltip: t('spendingBulkEditForm.categoryNameEditTooltip'),
      removeSpendingBulk: (_acrossAllCategories: boolean) => removeSpendingCategory(name),
      renameSpendingProperty: (newName: string, _acrossAllCategories: boolean) =>
        renameSpendingCategory(name, newName),
    }
  }

  const getSubCategoryFormProps = (name: string): BulkEditProps => {
    return {
      name: name,
      canSelectScope: !!categoryView,
      title: t('spendingBulkEditForm.subCategoryTitle'),
      nameLabel: t('spendingBulkEditForm.subCategoryName'),
      deleteDialogTitle: t('dialogs.deleteSubCategoryTitle'),
      deleteDialogContentText: t('dialogs.deleteSubCategoryContent', { name }),
      deleteDialogSuccessMessage: t('dialogs.deleteSubCategorySuccess', { name }),
      renameSuccessText: t('spendingBulkEditForm.subCategoryNameChangeSuccess', { oldName: name }),
      renameErrorText: t('spendingBulkEditForm.subCategoryNameChangeError', { name }),
      nameInputTooltip: t('spendingBulkEditForm.subCategoryNameEditTooltip'),
      removeSpendingBulk: (acrossAllCategories: boolean) =>
        removeSpendingSubCategory(name, acrossAllCategories),
      renameSpendingProperty: (newName: string, acrossAllCategories: boolean) =>
        renameSpendingSubCategory(name, newName, acrossAllCategories),
    }
  }

  const getStoreFormProps = (name: string): BulkEditProps => {
    return {
      name: name,
      canSelectScope: !!categoryView,
      title: t('spendingBulkEditForm.storeTitle'),
      nameLabel: t('spendingBulkEditForm.storeName'),
      deleteDialogTitle: t('dialogs.deleteStoreTitle'),
      deleteDialogContentText: t('dialogs.deleteStoreContent', { name }),
      deleteDialogSuccessMessage: t('dialogs.deleteStoreSuccess', { name }),
      renameSuccessText: t('spendingBulkEditForm.storeNameChangeSuccess', { oldName: name }),
      renameErrorText: t('spendingBulkEditForm.storeNameChangeError', { name }),
      nameInputTooltip: t('spendingBulkEditForm.storeNameEditTooltip'),
      removeSpendingBulk: (acrossAllCategories: boolean) =>
        removeSpendingStore(name, acrossAllCategories),
      renameSpendingProperty: (newName: string, acrossAllCategories: boolean) =>
        renameSpendingStore(name, newName, acrossAllCategories),
    }
  }

  const getTagFormProps = (name: string): BulkEditProps => {
    return {
      name: name,
      canSelectScope: !!categoryView,
      title: t('spendingBulkEditForm.tagTitle'),
      nameLabel: t('spendingBulkEditForm.tagName'),
      deleteDialogTitle: t('dialogs.deleteTagTitle'),
      deleteDialogContentText: t('dialogs.deleteTagContent', { name }),
      deleteDialogSuccessMessage: t('dialogs.deleteTagSuccess', { name }),
      renameSuccessText: t('spendingBulkEditForm.tagNameChangeSuccess', { oldName: name }),
      renameErrorText: t('spendingBulkEditForm.tagNameChangeError', { name }),
      nameInputTooltip: t('spendingBulkEditForm.tagNameEditTooltip'),
      removeSpendingBulk: (acrossAllCategories: boolean) =>
        removeSpendingTag(name, acrossAllCategories),
      renameSpendingProperty: (newName: string, acrossAllCategories: boolean) =>
        renameSpendingTag(name, newName, acrossAllCategories),
    }
  }

  return {
    getBulkEditFormProps,
  }
}
