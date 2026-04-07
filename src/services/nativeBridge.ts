import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Geolocation } from '@capacitor/geolocation';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Network } from '@capacitor/network';
import { PushNotifications } from '@capacitor/push-notifications';

/**
 * Single abstraction over Capacitor plugins. Feature code calls these methods
 * instead of importing Capacitor directly, which gives us:
 *   - One place to add web fallbacks
 *   - One place to add error handling and telemetry
 *   - A clean seam for unit tests
 */
export const nativeBridge = {
  isNative(): boolean {
    return Capacitor.isNativePlatform();
  },

  // ---------------------------------------------------------------------------
  // Camera
  // ---------------------------------------------------------------------------

  async takePhoto(): Promise<{ webPath: string; format: string } | null> {
    try {
      const photo = await Camera.getPhoto({
        quality: 80,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        allowEditing: false,
      });
      if (!photo.webPath) return null;
      return { webPath: photo.webPath, format: photo.format };
    } catch (err) {
      console.warn('takePhoto failed', err);
      return null;
    }
  },

  // ---------------------------------------------------------------------------
  // Geolocation
  // ---------------------------------------------------------------------------

  async getCurrentLocation(): Promise<{ lat: number; lng: number } | null> {
    try {
      if (!this.isNative() && !('geolocation' in navigator)) return null;
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10_000,
      });
      return { lat: position.coords.latitude, lng: position.coords.longitude };
    } catch (err) {
      console.warn('getCurrentLocation failed', err);
      return null;
    }
  },

  // ---------------------------------------------------------------------------
  // Push notifications
  // ---------------------------------------------------------------------------

  async registerForPush(onToken: (token: string) => void): Promise<void> {
    if (!this.isNative()) return; // Web fallback: no-op
    const permission = await PushNotifications.requestPermissions();
    if (permission.receive !== 'granted') return;

    await PushNotifications.register();
    PushNotifications.addListener('registration', (token) => onToken(token.value));
  },

  // ---------------------------------------------------------------------------
  // Filesystem
  // ---------------------------------------------------------------------------

  async writeJsonFile(name: string, data: unknown): Promise<void> {
    await Filesystem.writeFile({
      path: name,
      data: JSON.stringify(data),
      directory: Directory.Data,
      encoding: Encoding.UTF8,
    });
  },

  async readJsonFile<T>(name: string): Promise<T | null> {
    try {
      const file = await Filesystem.readFile({
        path: name,
        directory: Directory.Data,
        encoding: Encoding.UTF8,
      });
      return JSON.parse(file.data as string) as T;
    } catch {
      return null;
    }
  },

  // ---------------------------------------------------------------------------
  // Haptics
  // ---------------------------------------------------------------------------

  async tap(): Promise<void> {
    if (!this.isNative()) return;
    await Haptics.impact({ style: ImpactStyle.Light });
  },

  // ---------------------------------------------------------------------------
  // Network
  // ---------------------------------------------------------------------------

  async isOnline(): Promise<boolean> {
    const status = await Network.getStatus();
    return status.connected;
  },
};
