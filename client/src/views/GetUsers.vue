<template>
  <div class="card">
    <div class="card-header">
      <h4>Simple header</h4>
    </div>
    <div class="card-body">
      <div class="table-responsive">
        <div class="d-flex justify-content-center">
          <Pagination
            :isLarge="true"
            :currentPage="currentPage"
            :totalPages="totalPages"
            :perPage="perPage"
            @page-changed="onPageChanged"
          />
        </div>

        <div v-if="loading" class="">Loading...</div>

        <table v-if="!loading">
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Active?</th>
            <th>TokenVersion</th>
          </tr>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.isActive }}</td>
            <td>{{ user.tokenVersion }}</td>
          </tr>
        </table>
      </div>
    </div>

    <p>
      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Libero dolore aliquid cumque et, modi earum, culpa non
      deserunt animi omnis laborum facere quae? Quam beatae quos reiciendis cupiditate nemo accusamus, nisi velit magni
      facilis in et quod alias. Fugit soluta repellat, quae itaque a magni culpa commodi, iste laborum quos laudantium?
      Fugiat tempora similique tenetur fugit, odit dolores enim atque laudantium repellendus ipsam quae deserunt laborum
      veritatis porro, minus temporibus est dicta. A architecto qui corrupti magnam nulla recusandae error vitae
      suscipit ipsam quaerat, optio itaque tempora dicta doloremque voluptates eveniet, eum tenetur quo harum? Mollitia
      libero aliquid cupiditate blanditiis ut molestiae laborum, officia dicta nostrum ratione quae asperiores
      distinctio porro est laudantium voluptates alias quisquam. Nostrum, animi dolorem? Est obcaecati ex odio sit
      consequuntur excepturi sequi! Ducimus velit perferendis ipsam, molestiae illo, sequi voluptas minima reiciendis
      error harum minus explicabo alias adipisci fugit porro dicta accusantium. Nostrum perspiciatis sapiente
      voluptatibus distinctio dolore amet. Maxime perspiciatis dolore ducimus, facere perferendis nostrum obcaecati
      nulla reprehenderit tempore itaque quibusdam minus modi vitae rerum delectus ab provident, est temporibus. Beatae
      sit quia quam eum obcaecati, aliquid perferendis id quibusdam ipsam aut reprehenderit maxime ipsa alias pariatur
      minima, veritatis ad mollitia doloremque amet repudiandae labore facere culpa. Ut nam maiores officiis!
      Consequatur eos earum temporibus odio animi vel enim in mollitia voluptatum cupiditate error cum, ad nisi.
      Nesciunt laborum reprehenderit consectetur culpa molestiae cumque ex, quis officia dicta, voluptatibus excepturi
      non quaerat iste tempore numquam quia. Voluptate, iusto nesciunt sed sint, eum libero maxime autem optio quisquam
      deserunt sequi accusantium reprehenderit odio quis id dolor nobis at. Nulla, magnam! Quis atque qui mollitia rerum
      ducimus voluptatum cumque architecto sint quibusdam minus quos libero dolore fuga minima ab temporibus iste
      laboriosam ex, quae deserunt, dolores porro aliquid! Non atque a iure, ullam numquam minima culpa ducimus at?
      Officia in ducimus, sed nisi, porro beatae alias, laudantium corporis tempore saepe neque nulla similique debitis
      id deserunt libero aperiam totam numquam. Dolorem saepe cumque recusandae at accusamus veniam repellat dolorum
      quaerat, expedita explicabo porro ullam nesciunt doloremque non, illo aliquid necessitatibus unde in enim, nemo
      blanditiis totam ex ut! Quae a at saepe magnam in tempore deleniti fugit enim iure ducimus dolorem molestias
      doloremque excepturi quam numquam dicta illum dolor facere molestiae, dolores eos officia magni quidem. Sit
      dolorem voluptatem nemo sapiente, magnam velit assumenda ipsa, aliquid esse, accusamus reprehenderit cumque!
      Impedit magnam error, quis aliquam itaque iure rerum illo blanditiis fugiat accusantium sed rem, facilis
      repudiandae ab iusto quae. Voluptate illum qui itaque consectetur ullam rem voluptatem illo molestias minus
      voluptatum, a nisi dolorem, eaque expedita esse ad maiores alias provident minima sequi! Aliquam eos molestiae
      delectus ipsum velit illum recusandae nostrum, quos temporibus voluptate veniam cumque odio magnam rerum, omnis
      voluptatem quasi ipsam odit! Vero sed tenetur provident debitis non nemo earum quasi sint mollitia quaerat placeat
      inventore illum odio, harum hic alias porro nesciunt laboriosam quibusdam dolores sunt aliquid labore maxime
      assumenda. Hic magnam harum voluptates. Iusto earum aliquid cumque? Iure, nam aut! Eaque.
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      users: [],
      metaTag: null,
      currentPage: 1,
      perPage: 10,
      totalPages: null,
    }
  },

  methods: {
    onPageChanged(pageNumber) {
      //console.log(pageNumber)
      this.currentPage = pageNumber
      this.fetchData()
    },

    fetchData() {
      this.loading = true
      //console.log('Fetching...')
      setTimeout(() => {
        fetch(process.env.VUE_APP_API_BASE_URL + `/users?page=${this.currentPage}&limit=${this.perPage}`, {
          method: 'get',
          credentials: 'include',
          headers: { Authorization: `bearer ${this.$store.state.accessToken}` },
        })
          .then((res) => res.json())
          .then((data) => {
            this.users = data.users
            this.totalPages = data.totalPages
            this.loading = false
            //console.log(data)
          })
          .catch((err) => console.log(err.message))
      }, 500)
    },
  },
}
</script>

<style lang="scss" scoped></style>
