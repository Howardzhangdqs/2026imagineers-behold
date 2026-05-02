import { ref } from 'vue'
import { Howl } from 'howler'
import type { GameStage } from '@/types'

const audioBase = '/src/assets/audio/'

const sfxFiles: Record<string, string> = {
  pop: 'pop.mp3',
  buy: 'buy.mp3',
  attack: 'attack.mp3',
  counter: 'counter.mp3',
  cash: 'cash.mp3',
  stageTransition: 'stage_transition.mp3',
  endingFreeze: 'ending_freeze.mp3',
}

const bgmFiles: Record<string, string> = {
  '1': 'bgm_stage1.mp3',
  '2': 'bgm_stage1.mp3',
  '3': 'bgm_stage3.mp3',
  '4': 'bgm_stage4.mp3',
}

export function useAudio() {
  const bgmPlaying = ref<Howl | null>(null)
  const isMuted = ref(false)

  function playSfx(name: string) {
    if (isMuted.value) return
    const filename = sfxFiles[name]
    if (!filename) return
    const sound = new Howl({
      src: [audioBase + filename],
      volume: 0.5,
    })
    sound.play()
  }

  function playBgm(stage: GameStage) {
    if (isMuted.value) return
    if (bgmPlaying.value) {
      bgmPlaying.value.fade(1, 0, 500)
    }
    const filename = bgmFiles[String(stage)]
    if (!filename) return
    const bgm = new Howl({
      src: [audioBase + filename],
      volume: 0.3,
      loop: true,
      html5: true,
    })
    bgm.play()
    if (bgmPlaying.value) {
      setTimeout(() => {
        bgmPlaying.value?.stop()
      }, 600)
    }
    bgmPlaying.value = bgm
  }

  function stopBgm() {
    if (bgmPlaying.value) {
      bgmPlaying.value.stop()
      bgmPlaying.value = null
    }
  }

  function toggleMute() {
    isMuted.value = !isMuted.value
    if (isMuted.value) {
      stopBgm()
    }
  }

  return { playSfx, playBgm, stopBgm, toggleMute, isMuted }
}
