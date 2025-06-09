const Spinner = () => {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-[9999] flex justify-center items-center">
      <div className="w-10 h-10 border-4 border-[#015990] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Spinner;
