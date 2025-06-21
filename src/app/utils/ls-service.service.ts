import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
 providedIn: 'root'
})
export class LSService {

 static async setItem(key: string, data: any): Promise<void> {
  const stringData = typeof data === 'string' ? data : JSON.stringify(data);
  const encryptedData = btoa(stringData);
  await Preferences.set({ key, value: encryptedData });
 }

 static async getItem(key: string): Promise<any | null> {
  const { value } = await Preferences.get({ key });
  if (!value) return null;

  try {
   const decoded = atob(value);
   try {
    return JSON.parse(decoded);
   } catch {
    return decoded;
   }
  } catch (e) {
   console.error(`Error decoding Preferences key "${key}":`, e);
   return null;
  }
 }

 static async removeItem(key: string): Promise<void> {
  await Preferences.remove({ key });
 }

 static async clear(): Promise<void> {
  await Preferences.clear();
 }
}