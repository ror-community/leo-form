<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :isFocused="isFocused"
    :appliedOptions="appliedOptions"
  >
    <h6>Geonames Lookup</h6>
    <v-text-field
      type="number"
      :step="step"
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
      :value="control.data"
      @change="getAddress"
      @focus="isFocused = true"
      @blur="isFocused = false"
    />
  </control-wrapper>
</template>

<script lang="ts">
import {
  ControlElement,
  JsonFormsSubStates,
  Dispatch,
  Actions,
  JsonSchema,
  JsonFormsRendererRegistryEntry,
  rankWith,
  isIntegerControl,
  and,
  Tester,
  optionIs,
} from '@jsonforms/core';
import { defineComponent, inject} from '@vue/composition-api'
import {
  rendererProps,
  useJsonFormsControl,
  RendererProps,
} from '@jsonforms/vue2';
import { ControlWrapper } from '@jsonforms/vue2-vuetify';
import { useVuetifyControl } from '@jsonforms/vue2-vuetify';
import { VTextField } from 'vuetify/lib';
import { CoreActions } from '@jsonforms/core';
import set from 'lodash/fp/set';
import { env } from '../env';

export const customRenderer = defineComponent({
  name: 'custom-renderer',
  components: {
    ControlWrapper,
    VTextField,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const dispatch = inject<Dispatch<CoreActions>>('dispatch');
    const jsonforms = inject<JsonFormsSubStates>('jsonforms');
    const s = jsonforms?.core?.schema;
    const ui = jsonforms?.core?.uischema;
    const vControl = useVuetifyControl(
      useJsonFormsControl(props),
      (value) => parseInt(value, 10) || undefined
    );
    return { ...vControl, dispatch, jsonforms, s, ui };
  },
  methods: {
    fetchAddress(id: string) {
      const url = new URL(env().ADDRESS_URL);
      const params = { locationid: id }; // or:
      url.search = new URLSearchParams(params).toString();
      const rootData = this.jsonforms?.core?.data;
      fetch(url.toString()).then((response) => {
        response.json().then((data) => {
          console.log(data);
          if (data.address.geonames_city.id) {
            console.log("Address OK");
            console.log(rootData);
            if (this.dispatch) {
                let updatedData = rootData;
                updatedData = set(
                  'addresses.0',
                  data.address,
                  updatedData
                );
                updatedData = set(
                'addresses.0.geonames_city.id',
                parseInt(id),
                updatedData
                )
                updatedData = set(
                    'country.country_name',
                    data.country.country_name,
                    updatedData
                );
                updatedData = set(
                    'country.country_code',
                    data.country.country_code,
                    updatedData
                );
                this.dispatch(
                Actions.updateCore(updatedData, this.s as JsonSchema, this.ui)
                );
            }
          }
          else {
              alert("No geoname results found for id: " + id);
          }
        });
      });
    },
    getAddress(e: number) {
      const id = e.toString();
      this.fetchAddress(id);
    },
  },
  computed: {
    step(): number {
      const options: any = this.appliedOptions;
      return options.step ?? 1;
    },
  },
});

export default customRenderer

const locationIDTester: Tester = and(
  isIntegerControl,
  optionIs('locationId', true)
);

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: customRenderer,
  tester: rankWith(10, locationIDTester),
};
</script>
