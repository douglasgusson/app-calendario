<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title>
            <span class="headline">Login</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="usuario.login" label="Login"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="usuario.senha"
                    :append-icon="mostraSenha ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="mostraSenha ? 'text' : 'password'"
                    name="input-10-1"
                    label="Senha"
                    @click:append="mostraSenha = !mostraSenha"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="entrar">Entrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
export default {
  name: "Login",
  components: {},
  data: () => ({
    usuario: {},
    mostraSenha: false
  }),
  methods: {
    entrar() {
    //   localStorage.setItem("usuario", JSON.stringify(this.usuario));
      if (this.$route.query.nextUrl != null) {
        this.$router.push(this.$route.query.nextUrl);
      }
    }
  }
};
</script>