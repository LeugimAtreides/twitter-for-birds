export type Office = {
  types: [string],
  id: string
  address1: string
  state: [string]
  name: string
  phoneNumber: string
  parentId: string
  facilityName: string
  previousFacilityName: string
  fax: string
  alsoKnownAsFacilityName: string
  type: string
  in_network: string
}

export type ProviderProps = {
  provider: any, // object
  showVideoVisitFlag?: boolean,
  showAvailability?: boolean,
  showNewPatientFlag?: boolean,
  showRating?: boolean,
  showButton?: boolean,
  showEmployedFlag?: boolean,
  showNetworkFlag?: boolean,
  showInsuranceFlag?: boolean,
  buttonOnClick?(): any,
  office?: Office,
  showRequest?: boolean,
  ratingOnClick?(): any,
  blockName?: string,
  theme?: any,
}