<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :isFocused="isFocused"
    :appliedOptions="appliedOptions"
  >
    <v-hover v-slot="{ hover }">
      <v-autocomplete
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
        :items="getLang"
        item-text="name"
        item-value="iso639"
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
} from '@jsonforms/core';
import { defineComponent, inject } from '@vue/composition-api'
import {
  rendererProps,
  useJsonFormsControl,
  RendererProps,
} from '@jsonforms/vue2';
import { ControlWrapper } from '@jsonforms/vue2-vuetify';
import { useVuetifyControl } from '@jsonforms/vue2-vuetify';
import { VAutocomplete, VHover } from 'vuetify/lib';
import { CoreActions } from '@jsonforms/core';
import codes from 'iso-language-codes';


export const showLanguageRenderer = defineComponent({
  name: 'language-renderer',

  components: {
    ControlWrapper,
    VAutocomplete,
    VHover
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const dispatch = inject<Dispatch<CoreActions>>('dispatch');
    const vControl = useVuetifyControl(
      useJsonFormsControl(props),
      (value) => parseInt(value, 10) || undefined
    );
    return { ...vControl, dispatch };
  },
  data: () => ({
    iso639: ''
  }),
  computed: {
    getLang(): any[] {
      let lang = []
      for (const code in codes) {
        let name = codes[code].name
        let iso639 = codes[code].iso639_1
        lang.push({iso639: iso639, name: name})
      }
      return lang
    },
    step(): number {
      const options: any = this.appliedOptions;
      return options.step ?? 1;
    },
  },
  methods: {
    onChange(e: string) {
     console.log('me: ', this.control.path)
     if (this.dispatch) {
        this.dispatch(Actions.update(this.control.path, () => e));
     }
    }
  }
});

export default showLanguageRenderer

const langCodeTester: Tester = optionIs('langCode', true)


export const langEntry: JsonFormsRendererRegistryEntry = {
  renderer: showLanguageRenderer,
  tester: rankWith(10, langCodeTester),
};
</script>
