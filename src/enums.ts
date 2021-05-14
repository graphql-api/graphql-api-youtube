import { gql } from 'graphql-tag'

export const enumDefs = gql`
  enum PrivacyStatus {
    public
    private
  }
`
