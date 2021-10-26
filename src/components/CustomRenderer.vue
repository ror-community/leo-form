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
      @change="onChange"
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
    mapDict() {
      return [
        { path: 'addresses.lat', geoname: 'lat', type: 'float' },
        { path: 'addresses.lng', geoname: 'lng', type: 'float' },
        {
          path: 'addresses.country_geonames_id',
          geoname: 'countryId',
          type: 'int',
        },
        {
          path: 'addresses.geonames_city.city',
          geoname: 'name',
          type: 'string',
        },
        {
          path: 'addresses.city',
          geoname: 'name',
          type: 'string',
        },
        {
          path: 'country.country_name',
          geoname: 'countryName',
          type: 'string',
        },
        {
          path: 'country.country_code',
          geoname: 'countryCode',
          type: 'string',
        },
      ];
    },
    checkData(data: string, type: string) {
      switch (type) {
        case 'float':
          return parseFloat(data);
        case 'int':
          return parseInt(data);
        default:
          return data;
      }
    },
    mapGeoNamesAdmin(level: string) {
      return [
        { ror: 'name', geoname: 'adminName' + level, type: 'string' },
        { ror: 'ascii_name', geoname: 'adminName' + level, type: 'string' },
        { ror: 'id', geoname: 'adminId' + level, type: 'int' },
      ];
    },
    processGeoNamesAdmin(
      geonameResponse: any,
      data: any,
      level: string,
      fields: string[]
    ) {
      let path = 'addresses.geonames_city.geonames_admin' + level + '.';
      let geonamesAdmin = this.mapGeoNamesAdmin(level);
      for (const admin of geonamesAdmin) {
        data = set(
          path + admin.ror,
          this.checkData(geonameResponse[admin.geoname], admin.type),
          data
        );
      }
      data = set(path + 'code', fields.join('.'), data);
      return data;
    },
    fetchAddress(id: string) {
      const url = new URL('http://api.geonames.org/getJSON');
      const params = { geonameId: id, username: 'roradmin' }; // or:
      url.search = new URLSearchParams(params).toString();
      const rootData = this.jsonforms?.core?.data;
      fetch(url.toString()).then((response) => {
        response.json().then((data) => {
          if (this.dispatch) {
            let mapping = this.mapDict();
            let updatedData = rootData;
            updatedData = set(
              'addresses.geonames_city.id',
              parseInt(id),
              updatedData
            );
            for (const entry of mapping) {
              updatedData = set(
                entry.path,
                this.checkData(data[entry.geoname], entry.type),
                updatedData
              );
            }
            if (data.adminId1) {
              updatedData = this.processGeoNamesAdmin(data, updatedData, '1', [
                data.countryCode,
                data.adminCode1,
              ]);
              if (data.adminId2) {
                updatedData = this.processGeoNamesAdmin(
                  data,
                  updatedData,
                  '2',
                  [data.countryCode, data.adminCode1, data.adminCode2]
                );
              }
            }
            this.dispatch(
              Actions.updateCore(updatedData, this.s as JsonSchema, this.ui)
            );
          }
        });
      });
    },
    onChange(e: number) {
      const id = e.toString();
      this.fetchAddress(id);
      this.control.data = e;
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