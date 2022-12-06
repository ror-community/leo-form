import schema from './ror_schema.json'
import data from './data.json'
import uischema from './uischema.json'
import { UISchemaElement, JsonSchema } from '@jsonforms/core'

export const input: {
    schema: JsonSchema;
    uischema: UISchemaElement;
    data: any;
  } = { schema, uischema, data }
