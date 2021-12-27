import documents from "@/api/documents";
import documentTypes from "@/utils/documentTypes";
import { mapState } from "vuex";

/**
 * @description Provides data crossing between user documents and documents types
 */
export default {
  data() {
    return {
      documents: null,
      documentTypes
    };
  },
  computed: {
    ...mapState({ profile: state => state.Profiles.profile }),
    /**
     * @description Indicates if every required document type has an associated document
     * @returns {Boolean} Has every document
     */
    hasRequiredDocs() {
      if (!(this.documents && this.profile)) {
        return false;
      }

      if (this.checkDocuments()) {
        const isPassport = this.profile.document_type === "PASSPORT";
        if (isPassport) return true;
        else return this.checkNationalID();
      }
    }
  },
  methods: {
    /**
     * @description Fetch list of user's document
     */
    fetchDocuments() {
      documents
        .GetAll(this.$store.state.ActiveSession.token)
        .then(res => (this.documents = res))
        .catch(err => console.error(err));
    },
    checkDocuments() {
      const documentsTypeIds = this.documents.map(doc => doc.document_type_id);
      return this.documentTypes
        .filter(type => type.requiredBy.includes(this.profile.profile_type_id))
        .every(({ id }) => {
          return documentsTypeIds.includes(id);
        });
    },
    checkNationalID() {
      let front = this.documents.filter(
        obj =>
          obj.document_type_id === 1 &&
          obj.page === "front" &&
          obj.status_id != 3
      );
      let back = this.documents.filter(
        obj =>
          obj.document_type_id === 1 &&
          obj.page === "back" &&
          obj.status_id != 3
      );
      if (front.length >= 1 && back.length >= 1) return true;
      else return false;
    }
  },
  created() {
    this.fetchDocuments();
  }
};
