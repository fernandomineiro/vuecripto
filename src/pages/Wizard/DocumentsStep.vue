<template>
  <div>
    <div
      v-show="!completedSteps"
      :key="render"
      id="container"
      class="md-layout md-alignment-center-center"
    >
      <div class="md-layout-item md-size-100">
        <md-progress-bar
          v-show="loading"
          class="md-accent"
          md-mode="indeterminate"
        ></md-progress-bar>
        <md-steppers
          v-show="!loading"
          :md-active-step.sync="active"
          md-linear
          md-vertical
          md-alternative
        >
          <md-step
            v-if="!isPassport"
            id="frontId"
            :md-error="error"
            :md-done.sync="frontId"
            :md-editable="false"
            :md-label="$t('wizard.nationalId')"
            :md-description="$t('wizard.uploadFrontSide')"
          >
            <document-card
              :type="'nationalId'"
              :verse="'uploadFrontSide'"
              :steps="['frontId', 'backId']"
              ref="frontId"
              :documentFile="frontDocument"
              :documentType="documentTypes[0]"
              @set-done="setDone"
            />
          </md-step>
          <md-step
            v-if="!isPassport"
            id="backId"
            :md-error="error"
            :md-done.sync="backId"
            :md-editable="false"
            :md-label="$t('wizard.nationalId')"
            :md-description="$t('wizard.uploadBackSide')"
          >
            <document-card
              :type="'nationalId'"
              ref="backId"
              :verse="'uploadBackSide'"
              :steps="['backId', 'livenessPhoto']"
              :documentFile="backDocument"
              :documentType="documentTypes[0]"
              @set-done="setDone"
            />
          </md-step>
          <md-step
            v-if="isPassport"
            id="passport"
            :md-error="error"
            :md-done.sync="passport"
            :md-editable="false"
            :md-label="$t('wizard.passport')"
          >
            <document-card
              :type="'passport'"
              ref="passport"
              :steps="['passport', 'livenessPhoto']"
              :verse="'uploadFrontSide'"
              :documentType="documentTypes[0]"
              :documentFile="passportDocument"
              @set-done="setDone"
            />
          </md-step>
          <md-step
            :md-error="error"
            id="livenessPhoto"
            :md-done.sync="livenessPhoto"
            :md-editable="false"
            :md-label="$t('wizard.livenessPhoto')"
          >
            <liveness-photo
              :type="'livenessPhoto'"
              ref="livenessPhoto"
              :steps="['livenessPhoto', 'residencyProof']"
              :documentFile="livenessPhotoDocument"
              :documentType="documentTypes[1]"
              @set-done="setDone"
            />
          </md-step>
          <md-step
            :md-error="error"
            id="residencyProof"
            :md-done.sync="residencyProof"
            :md-editable="false"
            :md-label="$t('wizard.residencyProof')"
          >
            <document-card
              :type="'residencyProof'"
              ref="residencyProof"
              :steps="['residencyProof', 'companyIncorporation']"
              :documentFile="residencyProofDocument"
              :documentType="documentTypes[2]"
              @set-done="setDone"
            />
          </md-step>
          <md-step
            v-show="isComercial"
            :md-error="error"
            id="companyIncorporation"
            :md-editable="false"
            :md-done.sync="companyIncorporation"
            :md-label="$t('wizard.companyIncorporation')"
          >
            <document-card
              :type="'companyIncorporation'"
              ref="companyIncorporation"
              :steps="['companyIncorporation', 'articleOfAssociation']"
              :documentFile="companyIncorporationDocument"
              :documentType="documentTypes[3]"
              @set-done="setDone"
            />
          </md-step>
          <md-step
            v-show="isComercial"
            :md-error="error"
            id="articleOfAssociation"
            :md-editable="false"
            :md-done.sync="companyIncorporation"
            :md-label="$t('wizard.articleOfAssociation')"
          >
            <document-card
              :type="'articleOfAssociation'"
              ref="articleOfAssociation"
              :steps="['articleOfAssociation', 'finish']"
              :documentFile="articleOfAssociationDocument"
              :documentType="documentTypes[4]"
              @set-done="setDone"
            />
          </md-step>
        </md-steppers>
      </div>
    </div>
    <Finished v-show="completedSteps" class="md-layout-item md-size-100" />
  </div>
</template>

<script>
import DocumentCard from "@/components/Cards/DocumentCard";
import LivenessPhoto from "@/components/Cards/LivenessPhoto";
import Finished from "@/components/Cards/FinishedCard";
import documentsAPI from "@/api/documents";
import documentTypes from "@/utils/documentTypes";
import status from "@/utils/statuses";
import types from "@/utils/types";
import { mapActions, mapGetters, mapState } from "vuex";
const { PROFILE_COMMERCIAL } = types;

export default {
  name: "documents-send",
  components: {
    LivenessPhoto,
    DocumentCard,
    Finished
  },
  data() {
    return {
      render: 0,
      loading: true,
      active: "frontId",
      frontId: false,
      frontDocument: null,
      backId: false,
      backDocument: null,
      passport: false,
      passportDocument: null,
      livenessPhoto: false,
      livenessPhotoDocument: null,
      residencyProof: false,
      residencyProofDocument: null,
      companyIncorporation: false,
      companyIncorporationDocument: null,
      articleOfAssociation: false,
      articleOfAssociationDocument: null,
      error: null,
      completedSteps: false,
      isComercial: false,
      isPassport: false,
      documents: null,
      profileType: 1,
      documentTypes: null
    };
  },
  computed: {
    ...mapState({
      profile: state => state.Profiles.profile,
      loadingProfile: state => state.Profiles.loading,
      user: state => state.User
    }),
    ...mapGetters({ isProfileEmpty: "Profiles/isEmpty" })
  },
  created() {
    this.fetchUserDocuments();
  },
  watch: {
    active: function() {
      this.render += 1;
    }
  },
  methods: {
    ...mapActions({ fetchProfiles: "Profiles/fetchProfiles" }),
    async fetchUserDocuments() {
      this.profileType = this.profile.profile_type_id;

      this.isComercial = this.profileType === PROFILE_COMMERCIAL;

      this.documentTypes = documentTypes.filter(x =>
        x.requiredBy.includes(this.profileType)
      );

      this.isPassport = this.profile.document_type === "PASSPORT";
      this.active = this.isPassport ? "passport" : "frontId";

      await documentsAPI
        .GetAll(this.$store.state.ActiveSession.token)
        .then(res => {
          this.documents = res;
          this.checkDocuments(res);
        })
        .catch(() => null)
        .finally(() => {
          // if (this.frontId) {
          //   this.setDone("frontId", "backId");
          // } else if (this.passport) {
          //   this.setDone("passport", "livenessPhoto");
          // }
          this.render += 1;
        });
    },
    setDone(id, index) {
      this[id] = true;
      if (this[index] === true) {
        this.$refs[index].proceedToNextStep();
      } else {
        this.error = null;
        this.active = index;
        if (
          (index === "companyIncorporation" && !this.isComercial) ||
          (index === "finish" && this.isComercial)
        ) {
          this[id] = true;
          this.completedSteps = true;
        }
      }
    },
    changeStatus() {
      this.render += 1;
    },
    async checkDocuments(documents) {
      if (this.isPassport) {
        this.passportDocument = await this.checkFiltersIdentity(
          documents,
          1,
          "front"
        );
      } else {
        this.frontDocument = await this.checkFiltersIdentity(
          documents,
          1,
          "front"
        );
        this.backDocument = await this.checkFiltersIdentity(
          documents,
          1,
          "back"
        );
      }
      this.livenessPhotoDocument = await this.checkFilters(documents, 2);
      this.residencyProofDocument = await this.checkFilters(documents, 3);
      if (this.isComercial) {
        this.companyIncorporationDocument = await this.checkFilters(
          documents,
          4,
          null
        );
        this.articleOfAssociationDocument = await this.checkFilters(
          documents,
          5,
          null
        );
      }
      this.loading = false;
    },
    checkFiltersIdentity(documents, document_type_id, page) {
      let completed = this.filterDocumentsVerse(
        document_type_id,
        documents,
        status.STATUS_COMPLETE,
        page
      );
      let pending = this.filterDocumentsVerse(
        document_type_id,
        documents,
        status.STATUS_PENDING,
        page
      );

      let waiting = this.filterDocumentsVerse(
        document_type_id,
        documents,
        status.STATUS_WAITING,
        page
      );

      if (completed.length >= 1 || pending.length >= 1 || waiting.length >= 1) {
        if (!this.isPassport) {
          if (!this.frontId) {
            if (page === "front") {
              this.frontId = true;
              this.setDone("frontId", "backId");
            }
          }
          if (!this.backId) {
            if (page === "back") {
              this.backId = true;
              if (this.frontId) {
                this.setDone("backId", "livenessPhoto");
              }
            }
          }
        }

        if (this.isPassport) {
          if (!this.passport) {
            this.passport = true;
            this.setDone("passport", "livenessPhoto");
          }
        }
        return {};
      } else {
        let updateFilter = this.filterDocuments(
          document_type_id,
          documents,
          status.STATUS_CANCELED,
          page
        );
        if (updateFilter.length >= 1)
          return updateFilter[updateFilter.length - 1];
      }
    },
    checkFilters(documents, document_type_id) {
      let completed = this.filterDocuments(
        document_type_id,
        documents,
        status.STATUS_COMPLETE
      );
      let pending = this.filterDocuments(
        document_type_id,
        documents,
        status.STATUS_PENDING
      );

      let waiting = this.filterDocuments(
        document_type_id,
        documents,
        status.STATUS_WAITING
      );

      if (completed.length >= 1 || pending.length >= 1 || waiting.length >= 1) {
        if (!this.livenessPhoto) {
          this.livenessPhoto = document_type_id === 2;
          if (
            (this.frontId & this.backId || this.passport) & this.livenessPhoto
          )
            this.setDone("livenessPhoto", "residencyProof");
        }
        if (!this.residencyProof) {
          this.residencyProof = document_type_id === 3;
          if (this.isComercial) {
            if (
              (this.frontId & this.backId || this.passport) &
              this.livenessPhoto &
              this.residencyProof
            )
              this.setDone("residencyProof", "companyIncorporation");
          }
        }
        if (this.isComercial) {
          if (!this.companyIncorporation) {
            this.companyIncorporation = document_type_id === 4;
            if (
              (this.frontId & this.backId || this.passport) &
              this.livenessPhoto &
              this.residencyProof &
              this.companyIncorporation
            )
              this.setDone("residencyProof", "companyIncorporation");
          }
          if (!this.articleOfAssociation) {
            this.articleOfAssociation = document_type_id === 5;
          }
        }
        return {};
      } else {
        let updateFilter = this.filterDocuments(
          document_type_id,
          documents,
          status.STATUS_CANCELED
        );
        if (updateFilter.length >= 1)
          return updateFilter[updateFilter.length - 1];
      }
    },
    filterDocuments(document_type_id, documents, status) {
      let filter = {};
      if (document_type_id === 1) {
        filter = documents.filter(
          obj =>
            obj.document_type_id === document_type_id &&
            obj.status_id === status
        );
      } else {
        filter = documents.filter(
          obj =>
            obj.document_type_id === document_type_id &&
            obj.status_id === status
        );
      }
      return filter;
    },
    filterDocumentsVerse(document_type_id, documents, status, page) {
      let filter = {};
      if (document_type_id === 1) {
        filter = documents.filter(
          obj =>
            obj.document_type_id === document_type_id &&
            obj.status_id === status &&
            obj.page === page
        );
      } else {
        filter = documents.filter(
          obj =>
            obj.document_type_id === document_type_id &&
            obj.status_id === status &&
            obj.page === page
        );
      }
      return filter;
    }
  }
};
</script>

<style lang="scss" scoped>
.document-prototype {
  max-width: 300px;
  min-height: 150px;
}
.documents-card {
  list-style: none;
  padding: 0;

  .documents-item {
    padding: 0.5em;
    background: whitesmoke;
    border-radius: 0.5em;
    margin: 0.5em auto;
    cursor: pointer;

    &.complete {
      cursor: auto;
    }

    div {
      display: flex;
      flex-direction: row;
      align-items: center;

      div {
        padding: 0.5em;
      }
      .documents-item-status {
        flex-grow: 0;
        display: block;
        width: max-content;
        position: relative;
        .documents-item-badge {
          position: absolute;
          top: 0.5em;
        }
        .documents-item-icon {
          font-size: 3.5rem;
        }
      }
      .documents-item-description {
        flex-grow: 1;
        padding-left: 1.5em;
        z-index: 2;
      }
    }
  }
}
</style>
