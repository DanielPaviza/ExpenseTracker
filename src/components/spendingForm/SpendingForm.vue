<script setup lang="ts">
  import FormActions from '@components/spendingForm/shared/FormActions.vue'
  import FormAdditionalFields from '@components/spendingForm/shared/FormAdditionalFields.vue'
  import FormBasicFields from '@components/spendingForm/shared/FormBasicFields.vue'
  import FormTimestamps from '@components/spendingForm/shared/FormTimestamps.vue'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { type FormInst, NDrawer, NDrawerContent, NForm, useMessage } from 'naive-ui'

  import { computed, onUnmounted, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRoute, useRouter } from 'vue-router'

  import { useSpendingDialogAction } from '@/composables/useSpendingDialogAction'
  import { useSpendingFormData } from '@/composables/useSpendingFormData'
  import { useSpendingFormOptions } from '@/composables/useSpendingFormOptions'
  import { useSpendingFormValidation } from '@/composables/useSpendingFormValidation'

  const { deleteDialog } = useSpendingDialogAction()
  const { t } = useI18n()
  const store = useSpendingsStore()
  const formRef = ref<FormInst | null>(null)
  const route = useRoute()
  const router = useRouter()
  const message = useMessage()

  const show = computed(() => route.path === '/new' || route.path.startsWith('/edit/'))
  const drawerTitle = computed(() =>
    isEditMode.value ? t('form.editPurchase') : t('form.newPurchase'),
  )

  const { formData, currentSpending, isEditMode } = useSpendingFormData()
  const { rules } = useSpendingFormValidation()
  const { categoryOptions, payerOptions, subCategoryOptions, storeOptions, tagOptions } =
    useSpendingFormOptions(computed(() => formData.value))

  // Disable body scroll when drawer is open
  watch(
    show,
    (isShown) => {
      if (isShown) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    },
    { immediate: true },
  )

  function closeDrawer(): void {
    router.push('/')
  }

  async function handleSave(): Promise<void> {
    try {
      await formRef.value?.validate()
    } catch (error) {
      console.error('Spending field validation failed', error)
      message.error(t('messages.errorRequiredData'))
      return
    }

    try {
      // Update existing
      if (isEditMode.value && currentSpending.value) {
        const updatedSpending = {
          ...formData.value,
          editedAt: new Date(),
        }
        await store.updateSpending(currentSpending.value.id, updatedSpending)
        message.success(t('messages.purchaseEditedSuccessfully'))
      } else {
        // Create new
        await store.addSpending(formData.value)
        message.success(t('messages.purchaseCreatedSuccessfully'))
      }

      closeDrawer()
    } catch (error) {
      console.error('Validation failed:', error)
      message.error(t('messages.errorSavingPurchase'))
    }
  }

  async function handleDelete(): Promise<void> {
    if (!currentSpending.value) {
      return
    }

    await deleteDialog(currentSpending.value, null).then(() => {
      closeDrawer()
    })
  }

  onUnmounted(() => {
    document.body.style.overflow = ''
  })
</script>

<template>
  <n-drawer :show="show" width="80%" placement="right" @update:show="closeDrawer">
    <n-drawer-content :title="drawerTitle" closable class="p-4">
      <template #header>
        <div class="text-2xl font-bold text-blue">
          {{ drawerTitle }}
        </div>
      </template>
      <n-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-placement="top"
        require-mark-placement="right-hanging"
      >
        <FormTimestamps v-if="currentSpending" :spending="currentSpending" />

        <div class="flex gap-10">
          <FormBasicFields
            v-model:form-data="formData"
            :category-options="categoryOptions"
            :payer-options="payerOptions"
            :store-options="storeOptions"
            :is-edit-mode="isEditMode"
          />
          <FormAdditionalFields
            v-model:form-data="formData"
            :sub-category-options="subCategoryOptions"
            :tag-options="tagOptions"
          />
        </div>
      </n-form>

      <template #footer>
        <FormActions
          :is-edit-mode="isEditMode"
          @save="handleSave"
          @delete="handleDelete"
          @cancel="closeDrawer"
        />
      </template>
    </n-drawer-content>
  </n-drawer>
</template>
<style scoped>
  :deep(.n-base-close.n-base-close--absolute.n-drawer-header__close) {
    color: #c04141;
    font-size: larger;
    padding: 10px;
  }
  :deep(.n-base-clear__clear) {
    color: #c62828 !important;
  }
  :deep(.n-base-clear__clear:hover) {
    color: red !important;
  }
</style>
