export type attribute = {
  feature_attribute_type_id: number,
  name: string
  value: string,
}

export type featureProps = {
  feature_sort_order: number,
  feature_id: number,
  feature_type: string,
  attributes: [attribute]
}