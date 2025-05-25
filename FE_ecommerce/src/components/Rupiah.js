// components/Rupiah.js
const formatRupiah = (angka, prefix = "Rp") => {
  if (!angka) return prefix + "0";
  let number_string = angka.toString().replace(/[^,\d]/g, ""),
    split = number_string.split(","),
    sisa = split[0].length % 3,
    rupiah = split[0].substr(0, sisa),
    ribuan = split[0].substr(sisa).match(/\d{3}/g);

  if (ribuan) {
    rupiah += (sisa ? "." : "") + ribuan.join(".");
  }

  rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
  return prefix + rupiah;
};

const Rupiah = ({ value, className = "" }) => {
  return (
    <span className={className}>
      {formatRupiah(value)}
    </span>
  );
};

export default Rupiah;
