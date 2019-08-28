<template>
  <div id="app">
    <div v-if="loading == false">
      <nav class="navbar navbar-expand-sm bg-success navbar-dark">
        <a class="navbar-brand" href="#">Ponto</a>
      </nav>
      <div class="container-fluid center">
        <div class="row col-sm-12 my-3">
          <input placeholder="Pesquisar ..." class="form-control" v-model="filters.name.value" />
        </div>
        <div class="table-responsive">
          <v-table class="table table-hover table-striped my-3" :data="results" :filters="filters">
            <thead slot="head">
              <v-th sortKey="dia" defaultSort="desc">Dia</v-th>
              <v-th sortKey="funcionario">Funcionário</v-th>
              <th>Entrada</th>
              <th>Inicio da Pausa</th>
              <th>Retorno da Pausa</th>
              <th>Saída</th>
              <th>Horas Trabalhadas</th>
              <th>Horas de Pausa</th>
            </thead>
            <tbody slot="body" slot-scope="{displayData}">
              <tr v-for="row in displayData" :key="row.guid">
                <td>{{row.dia}}</td>
                <td>{{row.nameFuncionario}}</td>
                <td class="text-center">{{row.entrada}}</td>
                <td class="text-center">{{row.inicioPausa}}</td>
                <td class="text-center">{{row.retornoPausa}}</td>
                <td class="text-center">{{row.saida}}</td>
                <td class="text-center">{{row.horaTrabalhadas}}</td>
                <td class="text-center">{{row.horasPausa}}</td>
              </tr>
            </tbody>
          </v-table>
        </div>
      </div>
    </div>
    <div class="text-center" v-if="loading == true">
      <b-spinner type="grow" label="Loading..."></b-spinner>
    </div>
  </div>
</template>

<script>
import moment from "moment";
moment.locale("pt-BR");

export default {
  name: "app",
  components: { moment },
  data() {
    return {
      results: [],
      info: {},
      loading: true,
      filters: { name: { value: "", keys: ["nameFuncionario", "dia"] } }
    };
  },

  mounted() {
    this.$http
      .get("https://s3-sa-east-1.amazonaws.com/lar21css/desafio_frontend.json")
      .then(response => {
        this.info = response.data;
        let employees = this.info.employees;
        let days = this.info.days;
        let results = [];

        employees.map(function(e) {
          let result = {};

          days.map(function(d) {
            if (e.id == d.employee) {
              result.dia = moment(d.day, "YYYY/MM/DD HH:mm").format(
                "DD/MM/YYYY - dddd"
              );
              result.nameFuncionario = e.name;

              d.pontos.map(function(p) {
                if (p.kind == "entrada") result.entrada = p.time;
                if (p.kind == "inicio da pausa") result.inicioPausa = p.time;
                if (p.kind == "retorno da pausa") result.retornoPausa = p.time;
                if (p.kind == "saida") result.saida = p.time;
              });
            }
          });

          // variaveis
          let inicioPausa = result.inicioPausa
            ? moment(result.inicioPausa, "YYYY/MM/DD HH:mm")
            : null;
          let retornoPausa = result.retornoPausa
            ? moment(result.retornoPausa, "YYYY/MM/DD HH:mm")
            : null;
          let entrada = result.entrada
            ? moment(result.entrada, "YYYY/MM/DD HH:mm")
            : null;
          let saida = result.saida
            ? moment(result.saida, "YYYY/MM/DD HH:mm")
            : null;

          let horasPausa = 0.0;
          let periodo1 = 0.0;
          let periodo2 = 0.0;

          // Horas trabalhadas

          if (result.entrada != null && result.inicioPausa != null)
            periodo1 = moment
              .duration(inicioPausa.diff(entrada))
              .asMilliseconds();

          if (result.retornoPausa != null && result.saida != null)
            periodo2 = moment
              .duration(saida.diff(retornoPausa))
              .asMilliseconds();

          // Horas de Pausa

          if (result.inicioPausa != null && result.retornoPausa != null)
            horasPausa = moment
              .duration(retornoPausa.diff(inicioPausa))
              .asMilliseconds();

          // conversoes
          result.entrada =
            result.entrada != null
              ? moment(result.entrada, "YYYY/MM/DD HH:mm").format("HH:mm")
              : null;
          result.inicioPausa =
            result.inicioPausa != null
              ? moment(result.inicioPausa, "YYYY/MM/DD HH:mm").format("HH:mm")
              : null;
          result.retornoPausa =
            result.retornoPausa != null
              ? moment(result.retornoPausa, "YYYY/MM/DD HH:mm").format("HH:mm")
              : null;
          result.saida =
            result.saida != null
              ? moment(result.saida, "YYYY/MM/DD HH:mm").format("HH:mm")
              : null;
          result.horasPausa = moment.utc(horasPausa).format("HH:mm");
          result.horaTrabalhadas = moment
            .utc(periodo1 + periodo2)
            .format("HH:mm");

          results.push(result);
        });
        this.results = results;
        this.loading = false;
      })
      .catch(error => {
        console.log(error);
      });
  }
};
</script>



