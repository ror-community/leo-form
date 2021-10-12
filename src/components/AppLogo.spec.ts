import { shallowMount, createLocalVue, mount } from '@vue/test-utils'
import AppLogo from '@/components/AppLogo.vue'
import Vuetify from 'vuetify'

describe('AppLogo.vue', () => {
  const localVue = createLocalVue()
  let vuetify: Vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })
  it('renders the logo image', async () => {
    const wrapper = shallowMount(AppLogo, {
      localVue,
      vuetify
    })

    expect(wrapper.find('.v-image__image'))
  })
})
