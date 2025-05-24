const Contact = () => {
    return (
      <div className="p-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Kontak Kami</h1>
        <p className="text-lg">Hubungi kami melalui informasi berikut:</p>
        <div className="mt-6">
          <p className="text-lg font-semibold">Email: support@tokoonline.com</p>
          <p className="text-lg font-semibold">Telepon: +62 812 3456 7890</p>
          <p className="text-lg font-semibold">Alamat: Jl. E-commerce No. 1, Jakarta</p>
        </div>
        <img
          src="https://img.freepik.com/free-vector/hand-drawn-working-environment-template_52683-150328.jpg?t=st=1742826297~exp=1742829897~hmac=b6c9a4e7ed0df2ea889d6c760d49861b7392452ed9a1eba6b56f6c6553b6ccac&w=996"
          alt="Kontak Kami"
          className="rounded-lg mx-auto mt-6 shadow-lg"
        />
      </div>
    );
  };
  export default Contact;
  