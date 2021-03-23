<template>
  <div>
    <v-row>
      <v-btn block color="primary" x-large @click="gerarPDF">Gerar PDF</v-btn>
    </v-row>
  </div>
</template>

<script>
export default {
  data: () => ({}),
  methods: {
    showFile(blob) {
      // It is necessary to create a new blob object with mime-type explicitly set
      // otherwise only Chrome works like it should
      var newBlob = new Blob([blob], { type: 'application/pdf' });

      // IE doesn't allow using a blob object directly as link href
      // instead it is necessary to use msSaveOrOpenBlob
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(newBlob);
        return;
      }

      // For other browsers:
      // Create a link pointing to the ObjectURL containing the blob.
      const data = window.URL.createObjectURL(newBlob);
      var link = document.createElement('a');
      link.href = data;

      // link.innerText = "PDF";
      // link.download = "file.pdf";

      // let div = document.getElementById("link");
      // div.appendChild(link);

      link.click();

      setTimeout(function () {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(data);
      }, 100);
    },

    gerarPDF() {
      fetch('http://127.0.0.1:8000/api/v1/calendario/pdf?tema=verde')
        .then((r) => r.blob())
        .then(this.showFile);
    },
  },
};
</script>
