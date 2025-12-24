// src/utils/animations.ts
// Utility animation functions for Vue transitions
import { nextTick } from 'vue'

export const scrollFadeOnBeforeEnter = (el: Element): void => {
  ;(el as HTMLElement).style.height = '0'
  ;(el as HTMLElement).style.opacity = '0'
  ;(el as HTMLElement).style.transform = 'translateY(5px)'
}

export const scrollFadeOnEnter = (el: Element, done: () => void): void => {
  nextTick(() => {
    const scrollHeight = (el as HTMLElement).scrollHeight
    ;(el as HTMLElement).style.transition =
      'height 0.2s cubic-bezier(0.4,0,0.2,1), opacity 0.4s, transform 0.2s'
    ;(el as HTMLElement).style.height = scrollHeight + 'px'
    ;(el as HTMLElement).style.opacity = '1'
    ;(el as HTMLElement).style.transform = 'translateY(0)'
    setTimeout(() => {
      ;(el as HTMLElement).style.height = 'auto'
      done()
    }, 200)
  })
}

export const scrollFadeOnBeforeLeave = (el: Element): void => {
  ;(el as HTMLElement).style.height = (el as HTMLElement).scrollHeight + 'px'
  ;(el as HTMLElement).style.opacity = '1'
  ;(el as HTMLElement).style.transform = 'translateY(0)'
}

export const scrollFadeOnLeave = (el: Element, done: () => void): void => {
  nextTick(() => {
    ;(el as HTMLElement).style.transition =
      'height 0.2s cubic-bezier(0.4,0,0.2,1), opacity 0.4s, transform 0.2s'
    ;(el as HTMLElement).style.height = '0'
    ;(el as HTMLElement).style.opacity = '0'
    ;(el as HTMLElement).style.transform = 'translateY(20px)'
    setTimeout(done, 200)
  })
}
