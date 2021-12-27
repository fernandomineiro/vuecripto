<template>
  <div>
    <md-card>
      <md-card-header class="md-card-header-icon md-card-header-blue">
        <div class="card-icon">
          <i class="far fa-id-card"></i>
        </div>
        <h4 class="title">{{ $t("profile.documents.editDocuments") }}</h4>
      </md-card-header>
      <md-card-content>
        <div v-if="documentsLoading" class="text-center">
          <sync-loader color="#999999" />
        </div>
        <documents-card
          v-else
          :status="documentsStatus"
          :profile-type="profileType"
        />
      </md-card-content>
    </md-card>
    <doc-modal
      :doc-type="docModal.doctype"
      :doc-id="docModal.id"
      @close="docModalHide"
      v-if="docModal.show"
    />
  </div>
</template>

<script>
import SyncLoader from "vue-spinner/src/SyncLoader";
import DocModal from "@/components/Modals/DocModal.vue";
import DocumentsCard from "@/components/Cards/DocumentsCard";
import documents from "@/api/documents";
import { mapState } from "vuex";

export default {
  name: "user-documents",
  components: {
    SyncLoader,
    DocModal,
    DocumentsCard
  },
  data() {
    return {
      documentTypes: null,
      documents: null,
      docModal: {
        show: false,
        doctype: null,
        id: null
      },
      documentsLoading: false
    };
  },
  computed: {
    ...mapState({
      userId: state => state.User.id,
      profileType: state =>
        state.Profiles.count ? state.Profiles.profile.profile_type_id : 1
    }),
    documentsStatus() {
      return this.documents
        ? Object.fromEntries(
            this.documents.map(x => [x.document_type_id, x.status_id])
          )
        : null;
    }
  },
  methods: {
    getClass: function(headerColor) {
      return "md-card-header-" + headerColor + "";
    },
    showDocModal(document_type_id) {
      this.docModal.doctype = this.documentTypes.find(
        dt => dt.id == document_type_id
      );

      const doc = this.getDoc(document_type_id);
      this.docModal.id = doc ? doc.id : false;

      this.docModal.show = true;
    },
    fetchDocuments() {
      this.documentsLoading = true;
      documents
        .GetAll(this.$store.state.ActiveSession.token)
        .then(res => (this.documents = res))
        .catch(err => console.error(err))
        .finally(() => (this.documentsLoading = false));
    },
    getDoc(document_type_id) {
      const doc = this.documents.find(
        doc => doc.document_type_id == document_type_id
      );

      return doc !== undefined ? doc : false;
    },
    docModalHide() {
      this.docModal.show = false;
      this.fetchDocuments();
    }
  },
  mounted() {
    documents
      .GetDocumentTypes()
      .then(res => (this.documentTypes = res))
      .catch(err => console.error(err));

    this.fetchDocuments();
  }
};
</script>

<style scoped>
.far {
  font-size: 1rem;
}
</style>
