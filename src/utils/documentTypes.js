import types from "./types";
const { PROFILE_PERSONAL, PROFILE_COMMERCIAL } = types;

const documentTypes = [
  {
    id: 1,
    title: "id",
    icon: "far fa-id-card",
    requiredBy: [PROFILE_PERSONAL, PROFILE_COMMERCIAL],
    subTypes: {
      PASSPORT: ["front"],
      NATIONAL_DRIVE_LICENSE: ["front", "back"],
      NATIONAL_ID: ["front", "back"]
    }
  },
  {
    id: 2,
    title: "selfie",
    icon: "far fa-smile",
    requiredBy: [PROFILE_PERSONAL, PROFILE_COMMERCIAL]
  },
  {
    id: 3,
    title: "proofOfResidence",
    icon: "fas fa-home",
    requiredBy: [PROFILE_PERSONAL, PROFILE_COMMERCIAL]
  },
  {
    id: 4,
    title: "companyIncorporationDocument",
    icon: "far fa-file-alt",
    requiredBy: [PROFILE_COMMERCIAL]
  },
  {
    id: 5,
    title: "articleOfAssociation",
    icon: "far fa-address-book",
    requiredBy: [PROFILE_COMMERCIAL]
  }
];

export default documentTypes;
