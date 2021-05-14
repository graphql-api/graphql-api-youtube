import { gql } from 'graphql-tag'
import {
  URLTypeDefinition,
  URLResolver,
  DateTimeTypeDefinition,
  DateTimeResolver,
  JSONDefinition,
  JSONResolver
} from 'graphql-scalars'

export const scalarDefs = gql`
  ${URLTypeDefinition}
  ${DateTimeTypeDefinition}
  ${JSONDefinition}
`

export const scalarResolvers = {
  URL: URLResolver,
  DateTime: DateTimeResolver,
  JSON: JSONResolver
}
