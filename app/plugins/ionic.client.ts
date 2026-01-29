// Ionic Vue plugin - client-side only
import { IonicVue } from '@ionic/vue';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(IonicVue, {
    mode: 'md',
    animated: true
  });
});