<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :isFocused="isFocused"
    :appliedOptions="appliedOptions"
  >
    <v-hover v-slot="{ hover }">
      <v-select
        :id="control.id + '-input'"
        :class="styles.control.input"
        :disabled="!control.enabled"
        :autofocus="appliedOptions.focus"
        :placeholder="appliedOptions.placeholder"
        :label="computedLabel"
        :hint="control.description"
        :persistent-hint="persistentHint()"
        :required="control.required"
        :error-messages="control.errors"
        :clearable="hover"
        :value="control.data"
        :items="control.schema.items.enum"
        multiple
        @focus="isFocused = true"
        @blur="isFocused = false"
        @change="onChange"
      />
    </v-hover>
  </control-wrapper>
</template>

<script lang="ts">
import {
  ControlElement,
  JsonFormsRendererRegistryEntry,
  rankWith,
  Dispatch,
  Actions,
  Tester,
  optionIs,
  CoreActions
} from '@jsonforms/core'
import { defineComponent, inject } from '@vue/composition-api'
import {
  rendererProps,
  useJsonFormsControl,
  RendererProps
} from '@jsonforms/vue2'
import { ControlWrapper, useVuetifyControl } from '@jsonforms/vue2-vuetify'

import { VSelect, VHover } from 'vuetify/lib'

export const showTypeRenderer = defineComponent({
  name: 'type-renderer',

  components: {
    ControlWrapper,
    VSelect,
    VHover
  },
  props: {
    ...rendererProps<ControlElement>()
  },
  setup (props: RendererProps<ControlElement>) {
    const dispatch = inject<Dispatch<CoreActions>>('dispatch')
    const vControl = useVuetifyControl(
      useJsonFormsControl(props),
      (value) => parseInt(value, 10) || undefined
    )
    return { ...vControl, dispatch }
  },
  computed: {
    step (): number {
      const options: any = this.appliedOptions
      return options.step ?? 1
    }
  },
  methods: {
    onChange (e: string) {
      if (this.dispatch) {
        this.dispatch(Actions.update(this.control.path, () => e))
      }
    }
  }
})

export default showTypeRenderer

const typeTester: Tester = optionIs('type', true)

export const typeEntry: JsonFormsRendererRegistryEntry = {
  renderer: showTypeRenderer,
  tester: rankWith(10, typeTester)
}
</script>
