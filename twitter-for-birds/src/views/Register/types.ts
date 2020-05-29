
type EmptyCollectionType = {
  data: [],
  meta: { error: false, loading: false },
};

export type ownerType = {
  owner_first_name: string,
  owner_last_name: string,
  owner_phr_id: string,
  viewer_email: string,
  viewer_first_name: string,
  viewer_last_name: string,
  viewer_phr_id: string,
}

export type ProfilePickerProps = {
  blockName?: string,
  firstName: string,
  lastName: string,
  ownerPhrId: string,
  selectedPhrId: string | number,
  owners: EmptyCollectionType,
  setProfile(arg: string | number): any,
}