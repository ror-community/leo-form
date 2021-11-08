<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :isFocused="isFocused"
    :appliedOptions="appliedOptions"
  >
    <v-hover v-slot="{ hover }">
      <v-combobox
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
        multiple
        chips
        deletable-chips
        append-icon=""
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
  isPrimitiveArrayControl,
  and
} from '@jsonforms/core';
import { defineComponent, inject } from '@vue/composition-api'
import {
  rendererProps,
  useJsonFormsControl,
  RendererProps,
} from '@jsonforms/vue2';
import { ControlWrapper } from '@jsonforms/vue2-vuetify';
import { useVuetifyControl } from '@jsonforms/vue2-vuetify';
import { VCombobox, VHover } from 'vuetify/lib';
import { CoreActions } from '@jsonforms/core';


export const genListRenderer = defineComponent({
  name: 'list-renderer',

  components: {
    ControlWrapper,
    VCombobox,
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
  computed: {
    step(): number {
      const options: any = this.appliedOptions;
      console.log(this.appliedOptions)
      return options.step ?? 1;
    },
  },
  methods: {
    onChange(e: string) {
     if (this.dispatch ) {
        this.dispatch(Actions.update(this.control.path, () => e));
     }
    }
  }
});

export default genListRenderer

const genListTester: Tester = and(optionIs('genList', true), isPrimitiveArrayControl)


export const genListEntry: JsonFormsRendererRegistryEntry = {
  renderer: genListRenderer,
  tester: rankWith(10, genListTester),
};
</script>
