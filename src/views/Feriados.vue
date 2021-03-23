<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-alert v-model="alert.show" dismissible elevation="2" type="error">{{
          alert.message
        }}</v-alert>
      </v-col>
    </v-row>
    <v-data-table
      :loading="dataTableLoading"
      :headers="headers"
      :items="eventos"
      sort-by="calories"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Feriados</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Novo
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.descricao"
                        label="Nome"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12">
                      <v-menu
                        ref="menuDataFeriado"
                        v-model="menuDataFeriado"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="dataFeriadoFormatted"
                            label="Data"
                            persistent-hint
                            prepend-icon="mdi-calendar"
                            v-bind="attrs"
                            @blur="
                              editedItem.data_inicial = parseDate(
                                dataFeriadoFormatted
                              )
                            "
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="dataFeriado"
                          no-title
                          @input="menuDataFeriado = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>

                    <v-col cols="12">
                      <v-checkbox
                        v-model="editedItem.destacar_calendario"
                        label="Destacar no calendário"
                      ></v-checkbox>
                    </v-col>

                    <v-col cols="12">
                      <v-combobox
                        v-model="editedItem.classes_css"
                        item-text="nome"
                        :items="classes_css"
                        label="Marcadores"
                        multiple
                        clearable
                      ></v-combobox>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancelar
                </v-btn>
                <v-btn color="blue darken-1" text @click="save"> Salvar </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="headline"
                >Are you sure you want to delete this item?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancel</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="fetchRecords">Recarregar</v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import EventoService from '../service/domain/EventoService';

const service = EventoService.build();

export default {
  name: 'Feriados',
  data: (vm) => ({
    dialog: false,
    dialogDelete: false,
    dataTableLoading: true,

    menuDataFeriado: false,
    dataFeriado: new Date().toISOString().substr(0, 10),
    dataFeriadoFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),

    headers: [
      { text: 'Nome', align: 'start', value: 'descricao' },
      { text: 'Data', value: 'data_inicial' },
      { text: 'Destacar no calendário', value: 'destacar_calendario' },
      { text: 'Marcadores', value: 'classes_css' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],

    eventos: [],
    classes_css: ['feriado', 'aniversario'],

    editedIndex: -1,
    editedItem: {},

    defaultItem: {
      descricao: '',
      data_inicial: new Date().toISOString().substr(0, 10),
    },

    alert: {
      show: false,
      message: '',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Cadastro' : 'Edição';
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    dataFeriado(newValue) {
      this.dataFeriadoFormatted = this.formatDate(newValue);
      this.editedItem.data_inicial = newValue;
    },
  },

  created() {
    this.fetchRecords();
  },

  methods: {
    fetchRecords() {
      service.search({}).then(this.fetchRecodsSuccess);
    },

    fetchRecodsSuccess(response) {
      this.dataTableLoading = false;
      if (Array.isArray(response.rows)) {
        this.eventos = response.rows;
        return;
      }
      this.eventos = [];
    },

    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split('-');
      return `${day}/${month}/${year}`;
    },

    parseDate(date) {
      if (!date) return null;

      const [month, day, year] = date.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    },

    editItem(item) {
      this.editedIndex = this.eventos.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.eventos.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.eventos.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        service
          .update(this.editedItem)
          .then(Object.assign(this.eventos[this.editedIndex], this.editedItem));
      } else {
        service
          .create(this.editedItem)
          .then((response) => this.eventos.push(response))
          .catch((error) => (console.log(error.response.data)));
      }
      this.close();
    },
  },
};
</script>
