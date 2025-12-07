const CarForm = () => {
  const OnSubmit = async () => {};
  return (
    <div className="shadow rounded-lg p-4 m-4">
      <form className="flex flex-col gap-3" onSubmit={OnSubmit}>
        <label htmlFor="plateNumber">
          <p>رقم العربية</p>
        </label>

        <input
          type="text"
          id="plateNumber"
          placeholder="مصر 123"
          className="border rounded-full p-2"
        />

        <button
          type="submit"
          className="bg-blue-600 rounded-full p-2 hover:bg-blue-400 hover:cursor-pointer"
        >
          <p className="text-white">إضافة</p>
        </button>
      </form>
    </div>
  );
};

export default CarForm;
