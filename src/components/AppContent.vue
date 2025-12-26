<script setup lang="ts">
  import Header from '@components/Header.vue'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { useMessage } from 'naive-ui'

  import { onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const message = useMessage()

  const spendingsStore = useSpendingsStore()
  onMounted(async () => {
    const success = await spendingsStore.load()
    if (!success) message.error(t('messages.errorLoadingData'))
  })
</script>

<template>
  <Header />
  <router-view />
</template>
