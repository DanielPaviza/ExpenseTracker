<script setup lang="ts">
  import {
    AddOutline,
    GridOutline,
    KeypadOutline,
    MoonOutline,
    ReceiptOutline,
    SettingsOutline,
    SunnyOutline,
    WalletOutline,
  } from '@vicons/ionicons5'
  import { NButton, NIcon, NTooltip } from 'naive-ui'

  import { type Component, computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  import { type AppSection, useAppNavigation } from '@/composables/useAppNavigation'
  import { useTheme } from '@/composables/useTheme'
  import { useSpendingsStore } from '@/stores/spendingsStore'

  const emit = defineEmits<{ (e: 'open-shortcuts'): void }>()

  const { t } = useI18n()
  const isDev = import.meta.env.DEV
  const store = useSpendingsStore()
  const { section, goToSection, openNewSpending, openSettings } = useAppNavigation()
  const { isDark, toggleTheme } = useTheme()

  type NavItem = { key: AppSection; label: string; icon: Component; badge?: number }

  const navItems = computed<NavItem[]>(() => [
    { key: 'dashboard', label: t('nav.dashboard'), icon: GridOutline },
    {
      key: 'spendings',
      label: t('nav.spendings'),
      icon: ReceiptOutline,
      badge: store.spendings.length,
    },
  ])
</script>

<template>
  <aside class="flex w-64 shrink-0 flex-col border-r border-line bg-surface">
    <!-- Brand -->
    <div class="flex h-16 items-center gap-3 px-5">
      <div
        class="flex size-9 items-center justify-center rounded-xl bg-primary text-on-primary shadow-sm"
      >
        <n-icon size="20"><WalletOutline /></n-icon>
      </div>
      <div class="min-w-0">
        <div class="truncate text-[15px] font-semibold leading-tight tracking-tight">
          {{ t('appTitle') }}
        </div>
        <div class="text-xs text-fg-subtle">
          <span v-if="isDev" class="font-semibold text-danger">DEV · TEST</span>
          <span v-else>v0.1</span>
        </div>
      </div>
    </div>

    <!-- Primary action -->
    <div class="px-4 pt-2 pb-4">
      <n-button type="primary" block size="large" @click="openNewSpending()">
        <template #icon>
          <n-icon><AddOutline /></n-icon>
        </template>
        {{ t('header.addNewPurchase') }}
      </n-button>
      <div class="mt-1.5 flex justify-center gap-1 text-[11px] text-fg-subtle">
        <span class="kbd">Ctrl</span><span class="kbd">N</span>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex flex-col gap-1 px-3">
      <button
        v-for="item in navItems"
        :key="item.key"
        type="button"
        class="group flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors"
        :class="
          section === item.key
            ? 'bg-primary-soft text-primary'
            : 'text-fg-muted hover:bg-surface-2 hover:text-fg'
        "
        @click="goToSection(item.key)"
      >
        <n-icon size="18"><component :is="item.icon" /></n-icon>
        <span class="flex-1">{{ item.label }}</span>
        <span
          v-if="item.badge !== undefined"
          class="rounded-md px-1.5 py-0.5 text-[11px] font-semibold tabular-nums"
          :class="
            section === item.key ? 'bg-primary/15 text-primary' : 'bg-surface-3 text-fg-muted'
          "
        >
          {{ item.badge }}
        </span>
      </button>
    </nav>

    <div class="flex-1" />

    <!-- Footer actions -->
    <div class="flex flex-col gap-1 border-t border-line p-3">
      <button
        type="button"
        class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
        @click="openSettings()"
      >
        <n-icon size="18"><SettingsOutline /></n-icon>
        <span class="flex-1 text-left">{{ t('nav.settings') }}</span>
        <span class="flex gap-0.5"><span class="kbd">Ctrl</span><span class="kbd">,</span></span>
      </button>
      <button
        type="button"
        class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
        @click="emit('open-shortcuts')"
      >
        <n-icon size="18"><KeypadOutline /></n-icon>
        <span class="flex-1 text-left">{{ t('nav.shortcuts') }}</span>
        <span class="kbd">?</span>
      </button>

      <n-tooltip placement="right">
        <template #trigger>
          <button
            type="button"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
            @click="toggleTheme()"
          >
            <n-icon size="18">
              <SunnyOutline v-if="isDark" />
              <MoonOutline v-else />
            </n-icon>
            <span class="flex-1 text-left">
              {{ isDark ? t('settings.themeLight') : t('settings.themeDark') }}
            </span>
          </button>
        </template>
        {{ t('header.toggleTheme') }}
      </n-tooltip>
    </div>
  </aside>
</template>
