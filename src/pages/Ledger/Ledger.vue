<template>
  <div class="md-content">
    <div class="md-layout">
      <div class="md-layout-item">
        <md-card>
          <md-card-header class="md-card-header md-card-header-blue">
            <h4>{{ $t("invoices.accountBallance") }}</h4>
          </md-card-header>
          <md-card-content>
            <md-table
              v-model="pageContent"
              table-header-color="green"
              md-fixed-header
            >
              <md-table-toolbar class="md-layout-item md-size-33">
                <md-field>
                  <md-input
                    type="search"
                    class="search-input"
                    clearable
                    style="width: 200px"
                    :placeholder="this.$t('searchInTable')"
                    v-model="searchQuery"
                  ></md-input>
                </md-field>
              </md-table-toolbar>
              <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell :md-label="$t('invoices.invoice')">
                  {{ item.metadata.invoice }}
                </md-table-cell>
                <md-table-cell :md-label="$t('invoices.invoiceType')">
                  {{ $t(getInvoiceTypeLabel(item.metadata.invoice_type_id)) }}
                </md-table-cell>
                <md-table-cell :md-label="$t('invoices.date')">
                  {{ date(item.metadata.date) }}
                </md-table-cell>
                <md-table-cell :md-label="$t('invoices.baseCurrency')">
                  <currency-symbol :currency="item.metadata.currency_base_id" />
                </md-table-cell>
                <md-table-cell :md-label="$t('action')">
                  <md-button
                    class="md-just-icon md-round md-danger"
                    @click="detailsModalShow(item.metadata.id)"
                  >
                    <md-icon>add</md-icon>
                  </md-button>
                </md-table-cell>
              </md-table-row>
            </md-table>
            <pagination
              type="info"
              class="text-center"
              :page-count="pages.pageCount"
              v-model="currentPage"
              @input="changePage"
              v-if="pages"
            />
          </md-card-content>
        </md-card>
      </div>
    </div>
    <details-modal
      :invoice-types="invoiceTypes"
      :invoice-id="detailsModal.id"
      v-if="detailsModal.show"
      @close="detailsModal.show = false"
      @receipt="submitReceiptModalShow"
    />
    <submit-deposit-receipt-modal
      :deposit-id="submitReceiptModal.id"
      @close="submitReceiptModal.show = false"
      v-if="submitReceiptModal.show"
    />
  </div>
</template>

<script>
import invoice from "@/api/invoice";
import { createNamespacedHelpers } from "vuex";
import { Pagination } from "@/components";
import DetailsModal from "./DetailsModal.vue";
import SubmitDepositReceiptModal from "@/components/Modals/SubmitDepositReceipt.vue";
import { getLocaleDateString, PaginatedArray } from "@/utils";
import moment from "moment";
import { Promise } from "q";
import Fuse from "fuse.js";
import formatLabels from "@/mixins/formatLabels";
import CurrencySymbol from "@/components/CurrencySymbol";

const { mapState } = createNamespacedHelpers("Currencies");

export default {
  components: {
    DetailsModal,
    SubmitDepositReceiptModal,
    Pagination,
    CurrencySymbol
  },
  mixins: [formatLabels],
  data() {
    return {
      pages: null,
      searchQuery: "",
      fuse: "",
      searchResults: [],
      invoicesMap: [],
      currentPage: 1,
      invoices: [],
      invoiceTypes: {},
      detailsModal: {
        id: 0,
        show: false
      },
      submitReceiptModal: {
        id: null,
        show: false
      }
    };
  },
  computed: {
    ...mapState(["currencies"]),
    page() {
      return Number(this.$route.params.page) || 1;
    },
    pageContent() {
      if (this.pages) {
        return this.pages.pages[this.currentPage - 1];
      } else {
        return [];
      }
    },
    currencyTitle(id) {
      return this.currencies[id].title;
    }
  },
  methods: {
    detailsModalShow(id) {
      this.detailsModal.id = id;
      this.detailsModal.show = true;
    },
    submitReceiptModalShow(id) {
      this.submitReceiptModal.id = id;
      this.submitReceiptModal.show = true;
      this.detailsModal.show = false;
    },
    date(date) {
      return moment(date).format(getLocaleDateString() + " HH:mm:ss");
    },
    changePage(num) {
      this.$router.push({ name: "Invoices", params: { page: num } });
    },
    recreateTableWithResults(value) {
      if (value) {
        this.setSearchResults(value);
        this.setDataWithResults();
      } else {
        this.setDataPages(this.invoices);
      }
      this.returnTableToInitialPage();
    },
    fuseSearch(value) {
      return this.fuse.search(value);
    },
    setDataPages(pagesArray) {
      this.pages = new PaginatedArray(pagesArray);
    },
    setSearchResults(value) {
      this.searchResults = this.fuseSearch(value);
    },
    setDataWithResults() {
      if (this.searchResults.length) {
        this.setDataPages(this.searchResults);
      }
    },
    returnTableToInitialPage() {
      this.currentPage = 1;
    }
  },
  watch: {
    searchQuery(value) {
      this.recreateTableWithResults(value);
    }
  },
  created() {
    this.currentPage = this.page || 1;
    // Get invoices
    const getInvoicesPromise = invoice
      .GetAllInvoices()
      .then(res => {
        this.invoices = res.sort((a, b) => b.id - a.id);
      })
      .catch(err => console.error(err));
    //Get invoice types
    const getTypesPromise = invoice
      .GetInvoiceTypes()
      .then(res => {
        let types = {};
        for (const type of res) {
          types[type.id] = type;
        }
        this.invoiceTypes = types;
      })
      .catch(err => console.error(err));

    Promise.all([getInvoicesPromise, getTypesPromise]).then(() => {
      this.invoicesMap = this.invoices.map(item => {
        item.baseCurrency = item.metadata.currency_base_id;
        return item;
      });
      this.pages = new PaginatedArray(this.invoicesMap);
      console.log(this.pages);



      this.fuse = new Fuse(this.invoices, {
        threshold: 0.3,
        keys: [
          "metadata.invoice",
          "metadata.invoiceType",
          "metadata.date",
          "metadata.currency_base_id"
        ]
      });
    });
  },
  beforeRouteUpdate(to, from, next) {
    if (!to.params.page) {
      this.currentPage = 1;
    } else if (this.currentPage != to.params.page) {
      this.currentPage = Number(to.params.page);
    }
    next();
  }
};
</script>

<style scoped>
.md-card-header > h4 {
  color: #fff;
  font-weight: 700;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
