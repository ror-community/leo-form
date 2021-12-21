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
    mapDict(path: string) {
      return [
        { path: path+'lat', geoname: 'lat', type: 'float' },
        { path: path+'lng', geoname: 'lng', type: 'float' },
        {
          path: path+'country_geonames_id',
          geoname: 'countryId',
          type: 'int',
        },
        {
          path: path+'geonames_city.city',
          geoname: 'name',
          type: 'string',
        },
        {
          path: path+'city',
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
      p: string,
      geonameResponse: any,
      data: any,
      level: string,
      fields: string[]
    ) {
      let path = p + 'geonames_city.geonames_admin' + level + '.';
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
    fetchAddress(id: string, path: string) {
      const url = new URL(env().GEONAMES_URL+"/"+id);
      const rootData = this.jsonforms?.core?.data;
      fetch(url.toString()).then((response) => {
        response.json().then((data) => {
          if (data.geonameId) {
            if (this.dispatch) {
                let mapping = this.mapDict(path);
                let updatedData = rootData;
                updatedData = set(
                path+'geonames_city.id',
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
                    updatedData = this.processGeoNamesAdmin(path, data, updatedData, '1', [
                        data.countryCode,
                        data.adminCode1,
                ]);
                    if (data.adminId2) {
                        updatedData = this.processGeoNamesAdmin(
                            path,
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
          }
          else {
              alert("No geoname results found for id: " + id);
          }
        });
      }).catch((error) => {
        alert("GEONAMES api service is offline: " + error)
      });
    },
    onChange(e: number) {
      const regex = /(.*?addr.*?\d\.)/
      const path = regex.exec(this.control.path)
      let strPath = path ? path[0]: ''
      const id = e.toString();
      this.fetchAddress(id, strPath);
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
