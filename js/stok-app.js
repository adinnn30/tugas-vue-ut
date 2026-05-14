var app = new Vue({
  el: '#app',

  data: {
    upbjjList: dataSitta.upbjjList,
    kategoriList: dataSitta.kategoriList,
    stok: JSON.parse(JSON.stringify(dataSitta.stok)),

    filterUpbjj: '',
    filterKategori: '',
    filterReorder: false,
    sortBy: '',

    formEdit: null,
    editIndex: null,
    errorEdit: '',

    formBaru: {
      kode: '',
      judul: '',
      kategori: '',
      upbjj: '',
      lokasiRak: '',
      harga: 0,
      qty: 0,
      safety: 0,
      catatanHTML: ''
    },

    errorTambah: '',
    suksesMsg: '',
    logReorder: []
  },

  computed: {
    stokTampil() {
      let hasil = [...this.stok];

      if (this.filterUpbjj) {
        hasil = hasil.filter(item => item.upbjj === this.filterUpbjj);
      }

      if (this.filterUpbjj && this.filterKategori) {
        hasil = hasil.filter(item => item.kategori === this.filterKategori);
      }

      if (this.filterReorder) {
        hasil = hasil.filter(item => item.qty < item.safety || item.qty === 0);
      }

      if (this.sortBy === 'judul') {
        hasil.sort((a, b) => a.judul.localeCompare(b.judul));
      } else if (this.sortBy === 'qty') {
        hasil.sort((a, b) => a.qty - b.qty);
      } else if (this.sortBy === 'harga') {
        hasil.sort((a, b) => a.harga - b.harga);
      }

      return hasil;
    }
  },

  methods: {
    resetFilter() {
      this.filterUpbjj = '';
      this.filterKategori = '';
      this.filterReorder = false;
      this.sortBy = '';
    },

    editItem(index) {
      const kode = this.stokTampil[index].kode;
      this.editIndex = this.stok.findIndex(item => item.kode === kode);
      this.formEdit = Object.assign({}, this.stok[this.editIndex]);
      this.errorEdit = '';
    },

    simpanEdit() {
      if (!this.formEdit.judul) {
        this.errorEdit = 'Judul tidak boleh kosong!';
        return;
      }

      if (this.formEdit.qty < 0 || this.formEdit.safety < 0 || this.formEdit.harga < 0) {
        this.errorEdit = 'Qty, safety, dan harga tidak boleh negatif!';
        return;
      }

      this.stok.splice(this.editIndex, 1, Object.assign({}, this.formEdit));
      this.formEdit = null;
      this.editIndex = null;
      this.errorEdit = '';
    },

    tambahItem() {
      this.errorTambah = '';
      this.suksesMsg = '';

      if (
        !this.formBaru.kode ||
        !this.formBaru.judul ||
        !this.formBaru.kategori ||
        !this.formBaru.upbjj ||
        !this.formBaru.lokasiRak
      ) {
        this.errorTambah = 'Semua data wajib diisi!';
        return;
      }

      if (this.stok.some(item => item.kode === this.formBaru.kode)) {
        this.errorTambah = 'Kode mata kuliah sudah ada!';
        return;
      }

      if (this.formBaru.qty < 0 || this.formBaru.safety < 0 || this.formBaru.harga < 0) {
        this.errorTambah = 'Qty, safety, dan harga tidak boleh negatif!';
        return;
      }

      this.stok.push(Object.assign({}, this.formBaru));

      this.suksesMsg = 'Data bahan ajar berhasil ditambahkan!';

      this.formBaru = {
        kode: '',
        judul: '',
        kategori: '',
        upbjj: '',
        lokasiRak: '',
        harga: 0,
        qty: 0,
        safety: 0,
        catatanHTML: ''
      };
    }
  },

  watch: {
    filterUpbjj(newValue) {
      this.filterKategori = '';
      console.log('Filter UT-Daerah berubah:', newValue);
    },

    stok: {
      deep: true,
      handler(newValue) {
        this.logReorder = newValue.filter(item => item.qty < item.safety || item.qty === 0);
        console.log('Data stok berubah. Item perlu reorder:', this.logReorder);
      }
    }
  }
});