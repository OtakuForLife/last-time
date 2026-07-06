import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { Capacitor } from '@capacitor/core'

export async function tapFeedback(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return
  try {
    await Haptics.impact({ style: ImpactStyle.Light })
  } catch {
    // ponytail: haptics optional; ignore if unavailable
  }
}
