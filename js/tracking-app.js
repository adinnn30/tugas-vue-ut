var trackingVue = new Vue({
  el: '#trackingApp',

  data: {
    pengirimanList: app.pengirimanList,
    paket: app.paket,
    tracking: JSON.parse(JSON.stringify(app.tracking)),

    formDO: {
      nim: '',
      nama: '',
      ekspedisi: '',
      paketKode: '',
      tanggalKirim: ''
    },

    errorDO: '',
    suksesDO: '',

    cariDO: '',
    hasilTracking: null,
    sudahCari: false
  },

  computed: {
    nomorDOBaru() {
      const tahun = new Date().getFullYear();
      const jumlah = Object.keys(this.tracking).length + 1;
      return 'DO' + tahun + '-' + String(jumlah).padStart(4, '0');
    },

    paketDipilih() {
      if (!this.formDO.paketKode) {
        return null;
      }

      return this.paket.find(item => item.kode === this.formDO.paketKode);
    }
  },

  methods: {
    tambahDO() {
      this.errorDO = '';
      this.suksesDO = '';

      if (!this.formDO.nim || !this.formDO.nama) {
        this.errorDO = 'NIM dan nama wajib diisi!';
        return;
      }

      if (!this.formDO.ekspedisi) {
        this.errorDO = 'Ekspedisi wajib dipilih!';
        return;
      }

      if (!this.formDO.paketKode) {
        this.errorDO = 'Paket bahan ajar wajib dipilih!';
        return;
      }

      if (!this.formDO.tanggalKirim) {
        this.errorDO = 'Tanggal kirim wajib diisi!';
        return;
      }

      const nomorBaru = this.nomorDOBaru;

      this.$set(this.tracking, nomorBaru, {
        nim: this.formDO.nim,
        nama: this.formDO.nama,
        status: 'Diproses',
        ekspedisi: this.formDO.ekspedisi,
        tanggalKirim: this.formDO.tanggalKirim,
        paket: this.formDO.paketKode,
        total: this.paketDipilih.harga,
        perjalanan: [
          {
            waktu: new Date().toLocaleString('id-ID'),
            keterangan: 'DO dibuat dan sedang menunggu proses pengiriman'
          }
        ]
      });

      this.suksesDO = 'Delivery Order ' + nomorBaru + ' berhasil dibuat!';

      this.formDO = {
        nim: '',
        nama: '',
        ekspedisi: '',
        paketKode: '',
        tanggalKirim: ''
      };
    },

    cariTracking() {
      this.sudahCari = true;
      this.hasilTracking = this.tracking[this.cariDO] || null;
    }
  },

  watch: {
    'formDO.paketKode'(newValue) {
      if (newValue && this.paketDipilih) {
        console.log('Paket dipilih:', this.paketDipilih.nama);
      }
    },

    tracking: {
      deep: true,
      handler(newValue) {
        console.log('Data tracking berubah. Jumlah DO:', Object.keys(newValue).length);
      }
    }
  }
});