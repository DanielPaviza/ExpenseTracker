<script setup lang="ts">
  import Header from '@components/Header.vue'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { useMessage } from 'naive-ui'

  import { onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'

  const spendingsStore = useSpendingsStore()
  const message = useMessage()
  const { t } = useI18n()
  onMounted(async () => {
    try {
      await spendingsStore.load()
    } catch (error) {
      message.error(t('common.errorLoadingData'))
      console.error(t('common.errorLoadingData'), error)
    }
  })
</script>

<template>
  <Header />
  <router-view />
</template>
