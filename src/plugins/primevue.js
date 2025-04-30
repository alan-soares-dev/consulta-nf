import Aura from '@primeuix/themes/aura'
import PrimeVue from 'primevue/config'

const config = {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: 'light',
    },
  },
}

export default function (app) {
  app.use(PrimeVue, config)
}
