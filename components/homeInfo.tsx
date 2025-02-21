export function HomeInfo() {
  return (
    <div className="flex justify-center items-center w-full">
      <div className="flex flex-col justify-center items-center text-center">
        <h1 className="text-5xl font-bold mb-8">
          Welcome to <span className="italic tex">{process.env.SITE_NAME}</span>
          {" "}
          website
        </h1>
      </div>
    </div>
  );
}
