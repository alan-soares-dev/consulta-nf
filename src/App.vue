<template>
  <div class="app">
    <h1 class="title">Consulta de NF-e</h1>

    <FileUpload
      mode="basic"
      @select="onFileSelect"
      customUpload
      auto
      severity="secondary"
      class="p-button-outlined"
    />

    <!-- <input type="file" id="fileInput" />
    <script>
      document.getElementById('fileInput').addEventListener('change', function (event) {
        const file = event.target.files[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = function (e) {
            const fileContent = e.target.result
            console.log('File content:', fileContent)
            // You can now process the fileContent (e.g., display it, parse it)
          }
          reader.readAsText(file) // Or reader.readAsDataURL(file) for images
        }
      })
    </script> -->

    <FloatLabel>
      <label for="cnpj" class="font-bold block mb-2">CNPJ</label>
      <InputMask id="cnpj" mask="99.999.999/9999-99" v-model="cnpj" :unmask="true" />
      <PrimeButton label="Consultar" class="ml-2" @click="consultarCnpj" :loading="loading.cnpj" />
    </FloatLabel>

    <DataTable v-if="notas" :value="notas" :loading="loading.nota" :loading-text="'Carregando...'">
      <Column field="data" header="Data"></Column>
      <Column header="NF">
        <template #body="{ data }">
          <PrimeButton variant="link" @click="consultaNota(data.nf)">{{ data.nf }}</PrimeButton>
        </template>
      </Column>
      <Column field="xml" header="XML"></Column>
    </DataTable>

    <div v-if="nf">
      <h2 class="subtitle">Detalhes da Nota</h2>

      <Card>
        <template #title>Emissor</template>
        <template #content>
          <span>
            {{ nf.nfeProc.NFe.infNFe.emit.xNome }}, CNPJ: {{ nf.nfeProc.NFe.infNFe.emit.CNPJ }}
          </span>
          <!-- <pre>{{ nf.nfeProc.NFe.infNFe.emit }}</pre> -->
        </template>
      </Card>
      <Card>
        <template #title>Destinatário</template>
        <template #content>
          <span>
            {{ nf.nfeProc.NFe.infNFe.dest.xNome }}, CPF: {{ nf.nfeProc.NFe.infNFe.dest.CPF }}
          </span>
          <!-- <pre>{{ nf.nfeProc.NFe.infNFe.dest }}</pre> -->
        </template>

        <!-- <span
          >Destinatário:
          <pre>{{ nf.nfeProc.NFe.infNFe.dest }}</pre>
        </span> -->
      </Card>

      <div>
        <h2>Itens:</h2>
        <!-- <pre>{{ nf.nfeProc.NFe.infNFe.det }}</pre> -->

        <DataTable
          :value="nf.nfeProc.NFe.infNFe.det"
          :loading="loading.nota"
          :loading-text="'Carregando...'"
        >
          <Column field="nItem" header="Item"></Column>
          <Column field="prod.xProd" header="Produto"></Column>
        </DataTable>
      </div>
      <!-- <pre>{{ nf }}</pre> -->
    </div>
  </div>
  <Toast />
</template>

<script>
import PrimeButton from 'primevue/button'
import Card from 'primevue/card'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import FloatLabel from 'primevue/floatlabel'
import InputMask from 'primevue/inputmask'
import Toast from 'primevue/toast'
import FileUpload from 'primevue/fileupload'

export default {
  name: 'App',
  components: {
    PrimeButton,
    InputMask,
    FloatLabel,
    DataTable,
    Column,
    Toast,
    FileUpload,
    Card,
  },

  data() {
    return {
      notas_local: [
        {
          cnpj: '11111111111111',
          notas: [
            {
              data: '2023-01-01',
              nf: '35170608530528000184550000000154301000771561',
              xml: 'arquivo.xml',
            },
            {
              data: '2023-01-02',
              nf: '35161147508411011603551000077959551093041003',
              xml: 'arquivo.xml',
            },
            {
              data: '2023-01-03',
              nf: '53131205035672000156550010000004991543410167',
              xml: 'arquivo.xml',
            },
            {
              data: '2023-01-04',
              nf: '42140612687276000179550010001505671172228752',
              xml: 'arquivo.xml',
            },
          ],
        },

        {
          cnpj: '22222222222222',
          notas: [
            {
              data: '2023-01-05',
              nf: '35140903608306000202555000001100251571436929',
              xml: 'arquivo.xml',
            },
            {
              data: '2023-01-06',
              nf: '53150337992500000167550010000029521000029516',
              xml: 'arquivo.xml',
            },
            {
              data: '2023-01-07',
              nf: '33190403282458000179550010001434641841176079',
              xml: 'arquivo.xml',
            },
          ],
        },
      ],

      nf: null,
      notas: null,
      loading: {
        cnpj: false,
        nota: false,
      },
      cnpj: '',
    }
  },

  methods: {
    onFileSelect(event) {
      const file = event.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const fileContent = e.target.result
          console.log('File content:', fileContent)
          // You can now process the fileContent (e.g., display it, parse it)
        }
        reader.readAsText(file) // Or reader.readAsDataURL(file) for images
      }
    },

    consultaNota(nf) {
      this.loading.nota = true
      this.$http
        .get(`/nfe/${nf}`)
        .then((response) => {
          this.nf = response.data
        })
        .catch((error) => {
          this.$toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
            life: 3000,
          })
        })
        .finally(() => {
          this.loading.nota = false
        })
    },

    consultarCnpj() {
      this.loading.cnpj = true

      setTimeout(() => {
        const n = this.notas_local.find((item) => item.cnpj === this.cnpj)

        if (n) {
          this.notas = n.notas
        } else {
          this.notas = null
          this.nf = null
          this.$toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'CNPJ não encontrado. Tente: 11.111.111/1111-11 ou 22.222.222/2222-22',
            life: 3000,
          })
        }
        this.loading.cnpj = false
      }, 700)
    },
  },
}
</script>
<style>
.app {
  margin: 0 3em;
}

.title {
  text-align: center;
}

.subtitle {
  text-align: center;
  margin-top: 1em;
}
</style>
