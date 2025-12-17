<script setup lang="ts">
  import Tooltip from '@components/Tooltip.vue'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { formatDate } from '@utils/formatUtils'
  import { OpenOutline, SaveOutline, TrashOutline } from '@vicons/ionicons5'
  import {
    type FormInst,
    type FormRules,
    NButton,
    NCheckbox,
    NDatePicker,
    NDrawer,
    NDrawerContent,
    NForm,
    NFormItem,
    NIcon,
    NInput,
    NInputNumber,
    NSelect,
    useDialog,
    useMessage,
  } from 'naive-ui'

  import { computed, onUnmounted, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { Spending } from '@/types/Spending'

  const store = useSpendingsStore()
  const formRef = ref<FormInst | null>(null)
  const route = useRoute()
  const router = useRouter()
  const dialog = useDialog()
  const message = useMessage()

  const show = computed(() => route.path === '/new' || route.path.startsWith('/edit/'))
  const isEditMode = computed(() => route.path.startsWith('/edit/'))
  const drawerTitle = computed(() => (isEditMode.value ? 'Upravit nákup' : 'Nový nákup'))

  // Get spending from store based on route param
  const currentSpending = computed(() => {
    if (isEditMode.value) {
      const id = route.params.id as string
      return store.spendings.find((s) => s.id === id) || null
    }
    return null
  })

  const defaultFormData = {
    category: '',
    type: '',
    name: '',
    isToBePaid: false,
    isFree: false,
    payer: '',
    quantity: 1,
    unitPrice: 0,
    dimensions: '',
    url: '',
    document: '',
    store: '',
    storeCode: '',
    description: '',
    subCategory: '',
    tags: [] as string[],
    createdAt: new Date(),
  }

  const setNewFormData = (spending: Spending) => {
    return {
      category: spending.category,
      type: spending.type,
      name: spending.name,
      isToBePaid: spending.isToBePaid,
      isFree: spending.isFree,
      payer: spending.payer,
      quantity: spending.quantity,
      unitPrice: spending.unitPrice,
      dimensions: spending.dimensions ?? '',
      url: spending.url ?? '',
      document: spending.document ?? '',
      store: spending.store ?? '',
      storeCode: spending.storeCode ?? '',
      description: spending.description ?? '',
      subCategory: spending.subCategory ?? '',
      tags: spending.tags ?? [],
      createdAt: spending.createdAt,
    }
  }

  // Form data
  const formData = ref(defaultFormData)

  // Watch for changes to the current spending to populate form
  watch(
    currentSpending,
    (currentSpending) => {
      if (currentSpending) {
        formData.value = setNewFormData(currentSpending)
      } else {
        console.log(route.query)
        if (route.query.template) {
          const templateSpending = store.spendings.find(
            (s) => s.id === (route.query.template as string),
          )
          if (templateSpending) {
            formData.value = setNewFormData(templateSpending)
            return
          }
        }
        resetForm()
      }
    },
    { immediate: true },
  )

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

  // Form validation rules
  const rules: FormRules = {
    category: [{ required: true, message: 'Kategorie je povinná', trigger: 'blur' }],
    type: [{ required: true, message: 'Typ je povinný', trigger: 'blur' }],
    name: [{ required: true, message: 'Název je povinný', trigger: 'blur' }],
    payer: [{ required: true, message: 'Plátce je povinný', trigger: 'blur' }],
    quantity: [
      {
        required: true,
        type: 'number',
        message: 'Množství je povinné',
        trigger: ['blur', 'change'],
      },
      {
        type: 'number',
        min: 0,
        message: 'Množství musí být alespoň 0',
        trigger: ['blur', 'change'],
      },
    ],
    unitPrice: [
      {
        required: true,
        type: 'number',
        message: 'Jednotková cena je povinná',
        trigger: ['blur', 'change'],
      },
      {
        type: 'number',
        min: 0,
        message: 'Cena nemůže být záporná',
        trigger: ['blur', 'change'],
      },
    ],
  }

  // Options for select dropdowns from store
  const categoryOptions = computed(() => {
    return store.categories.map((cat) => ({ label: cat, value: cat }))
  })

  const payerOptions = computed(() => {
    return store.payers.map((payer) => ({ label: payer, value: payer }))
  })

  const subCategoryOptions = computed(() => {
    return [
      ...store.subCategories.map((subCategory) => ({ label: subCategory, value: subCategory })),
      ...formData.value.tags.map((tag) => ({ label: tag, value: tag })),
    ]
  })

  const storeOptions = computed(() => {
    return store.stores.map((store) => ({ label: store, value: store }))
  })

  const tagOptions = computed(() => {
    let allTags = store.tags.map((tag) => ({ label: tag, value: tag }))
    if (!!formData.value.subCategory)
      allTags.push({ label: formData.value.subCategory, value: formData.value.subCategory })
    return allTags
  })

  const totalPrice = computed(() => {
    return formData.value.quantity * formData.value.unitPrice
  })

  // Convert Date to timestamp for date picker
  const createdAtTimestamp = computed({
    get: () => formData.value.createdAt.getTime(),
    set: (value: number) => {
      formData.value.createdAt = new Date(value)
    },
  })

  function resetForm() {
    formData.value = {
      ...defaultFormData,
      createdAt: new Date(),
    }
  }

  function closeDrawer() {
    router.push('/')
  }

  async function handleSave() {
    try {
      await formRef.value?.validate()

      const spendingData: Partial<Spending> = {
        category: formData.value.category,
        type: formData.value.type,
        name: formData.value.name,
        isToBePaid: formData.value.isToBePaid,
        isFree: formData.value.isFree,
        payer: formData.value.payer,
        quantity: formData.value.quantity,
        unitPrice: formData.value.unitPrice,
        dimensions: formData.value.dimensions || null,
        url: formData.value.url || null,
        document: formData.value.document || null,
        store: formData.value.store || null,
        storeCode: formData.value.storeCode || null,
        description: formData.value.description || null,
        subCategory: formData.value.subCategory || null,
        tags: formData.value.tags || [],
      }

      if (isEditMode.value && currentSpending.value) {
        // Update existing
        const updatedSpending = new Spending({
          ...spendingData,
          id: currentSpending.value.id,
          createdAt: currentSpending.value.createdAt,
          editedAt: new Date(),
        })
        await store.updateSpending(currentSpending.value.id, updatedSpending)
        message.success('Nákup byl úspěšně upraven')
      } else {
        // Create new
        const newSpending = new Spending({
          ...spendingData,
          createdAt: formData.value.createdAt,
        })
        await store.addSpending(newSpending)
        message.success('Nákup byl úspěšně vytvořen')
      }

      closeDrawer()
      resetForm()
    } catch (error) {
      console.error('Validation failed:', error)
      message.error('Chyba při ukládání nákupu')
    }
  }

  function handleDelete() {
    if (!currentSpending.value) return

    dialog.warning({
      title: 'Smazat nákup',
      content: `Opravdu chcete smazat "${currentSpending.value.name}"?`,
      positiveText: 'Smazat',
      negativeText: 'Zrušit',
      onPositiveClick: async () => {
        if (currentSpending.value) {
          await store.removeSpending(currentSpending.value.id)
          message.success(`Nákup byl úspěšně smazán`)
          closeDrawer()
          resetForm()
        }
      },
    })
  }

  onUnmounted(() => {
    document.body.style.overflow = ''
  })
</script>

<template>
  <n-drawer :show="show" @update:show="closeDrawer" width="80%" placement="right">
    <n-drawer-content :title="drawerTitle" closable class="p-4">
      <template #header>
        <div class="text-2xl font-bold text-blue">{{ drawerTitle }}</div>
      </template>
      <n-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-placement="top"
        require-mark-placement="right-hanging"
      >
        <!-- Timestamps for edit mode -->
        <div v-if="!!currentSpending?.createdAt" class="flex gap-8 text-sm mb-4">
          <div class="">
            <span class="font-semibold text-gray-700">Vytvořeno:</span>
            <span class="ml-1 text-gray-600">{{ formatDate(currentSpending!.createdAt) }}</span>
          </div>
          <div v-if="!!currentSpending?.editedAt" class="">
            <span class="font-semibold text-gray-700">Upraveno:</span>
            <span class="ml-1 text-gray-600">{{ formatDate(currentSpending.editedAt) }}</span>
          </div>
        </div>

        <div class="flex gap-10">
          <div class="flex-1">
            <!-- Required fields -->
            <n-form-item label="Kategorie" path="category">
              <n-select
                v-model:value="formData.category"
                :options="categoryOptions"
                placeholder="Vyberte kategorii"
                filterable
                tag
              />
            </n-form-item>

            <n-form-item label="Typ" path="type">
              <n-input v-model:value="formData.type" placeholder="Typ nákupu" />
            </n-form-item>

            <n-form-item label="Název" path="name">
              <n-input v-model:value="formData.name" placeholder="Název položky" />
            </n-form-item>

            <n-form-item v-if="!isEditMode" label="Datum vytvoření" path="createdAt">
              <n-date-picker
                v-model:value="createdAtTimestamp"
                type="datetime"
                placeholder="Vyberte datum a čas"
                class="w-full"
                format="dd.MM.yyyy HH:mm"
              />
            </n-form-item>

            <n-form-item label="Plátce" path="payer">
              <n-select
                v-model:value="formData.payer"
                :options="payerOptions"
                placeholder="Vyberte plátce"
                filterable
                tag
              />
            </n-form-item>

            <n-form-item label="Obchod" path="store">
              <n-select
                v-model:value="formData.store"
                :options="storeOptions"
                placeholder="Vyberte obchod"
                filterable
                tag
                clearable
              />
            </n-form-item>

            <div class="flex gap-4">
              <n-form-item label="Množství" path="quantity" class="flex-1">
                <n-input-number
                  v-model:value="formData.quantity"
                  :min="0"
                  :step="1"
                  class="w-full"
                />
              </n-form-item>

              <n-form-item label="Jednotková cena (Kč)" path="unitPrice" class="flex-1">
                <n-input-number
                  v-model:value="formData.unitPrice"
                  :min="0"
                  :step="100"
                  :placeholder="String(formData.unitPrice)"
                  :show-button="false"
                  class="w-full"
                />
              </n-form-item>
            </div>

            <div class="mb-4 p-3 bg-blue-50 rounded flex justify-center">
              <div class="text-lg font-bold text-blue">
                Celková cena: {{ totalPrice.toLocaleString('cs-CZ') }} Kč
              </div>
            </div>
          </div>
          <div class="flex-1">
            <div class="flex justify-center">
              <div class="flex gap-20">
                <n-form-item label="Prozatím nezaplaceno">
                  <template #label>
                    <div class="flex items-center gap-1">
                      Prozatím nezaplaceno
                      <Tooltip text="Položka ještě nebyla zaplacena a čeká na úhradu" />
                    </div>
                  </template>
                  <n-checkbox v-model:checked="formData.isToBePaid">{{
                    formData.isToBePaid ? 'Ano' : 'Ne'
                  }}</n-checkbox>
                </n-form-item>

                <n-form-item label="Ušetřeno">
                  <template #label>
                    <div class="flex items-center gap-1">
                      Ušetřeno
                      <Tooltip text="Položka byla získána zdarma" />
                    </div>
                  </template>
                  <n-checkbox v-model:checked="formData.isFree">{{
                    formData.isFree ? 'Ano' : 'Ne'
                  }}</n-checkbox>
                </n-form-item>
              </div>
            </div>

            <n-form-item path="subCategory">
              <template #label>
                <div class="flex items-center gap-1">
                  Skupina
                  <Tooltip text="Vizuální seskupení položek v tabulkách" />
                </div>
              </template>
              <n-select
                v-model:value="formData.subCategory"
                :options="subCategoryOptions"
                placeholder="Vyberte skupinu"
                filterable
                tag
                clearable
              />
            </n-form-item>

            <n-form-item label="Tagy" path="tags">
              <n-select
                v-model:value="formData.tags"
                :options="tagOptions"
                placeholder="Vyberte tagy"
                filterable
                multiple
                tag
                clearable
              />
            </n-form-item>

            <n-form-item label="Kód zboží" path="storeCode">
              <n-input v-model:value="formData.storeCode" placeholder="Kód zboží" clearable />
            </n-form-item>

            <n-form-item label="Rozměry" path="dimensions">
              <n-input v-model:value="formData.dimensions" placeholder="Rozměry" clearable />
            </n-form-item>

            <n-form-item label="URL" path="url">
              <div class="flex gap-2 w-full">
                <div class="w-full">
                  <n-input v-model:value="formData.url" placeholder="https://..." clearable />
                </div>
                <a v-if="formData.url" :href="formData.url" target="_blank">
                  <n-button color="#3b82f6" title="Otevřít odkaz">
                    <template #icon>
                      <n-icon>
                        <OpenOutline />
                      </n-icon>
                    </template>
                  </n-button>
                </a>
              </div>
            </n-form-item>

            <n-form-item label="Technický list" path="document">
              <n-input
                v-model:value="formData.document"
                placeholder="Odkaz na technický list"
                clearable
              />
            </n-form-item>

            <n-form-item label="Popis" path="description">
              <n-input
                v-model:value="formData.description"
                type="textarea"
                placeholder="Podrobný popis..."
                :rows="4"
                clearable
              />
            </n-form-item>
          </div>
        </div>
      </n-form>

      <template #footer>
        <div class="flex justify-between w-full gap-3">
          <div class="flex gap-3">
            <n-button @click="closeDrawer" color="#60a5fa">Zrušit</n-button>
            <n-button v-if="isEditMode" @click="handleDelete" color="#ef4444">
              <template #icon>
                <n-icon>
                  <TrashOutline />
                </n-icon>
              </template>
              Smazat
            </n-button>
          </div>
          <n-button color="#3b82f6" @click="handleSave">
            <template #icon>
              <n-icon>
                <SaveOutline />
              </n-icon>
            </template>
            {{ isEditMode ? 'Uložit změny' : 'Vytvořit nákup' }}
          </n-button>
        </div>
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
