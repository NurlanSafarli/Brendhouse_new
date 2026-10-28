// User-confirmed policies. Replace this single source with approved PolicySet API
// when the admin/policy module is available; do not duplicate in page components.
export const confirmedPolicy = {
  returnDays: 14,
  freeDeliveryQepik: 6000,
  bakuDeliveryQepik: 500,
  doorInspection: true,
  whatsapp: "994503044811",
} as const;
