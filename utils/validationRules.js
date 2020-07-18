export const nameRules = {
  required: (v) => !!v || 'Name is required',
  max: (v) => (v && v.length <= 10) || 'Name must be less than 10 characters',
}

export const facilityIdRules = {
  number: (v) => !isNaN(v) || 'Facility ID must be number',
  max: (v) => (v && v.length <= 3) || 'Facility must be less than 3 characters',
}
