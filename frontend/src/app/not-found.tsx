import notfound from "../../public/assets/notfound.png"
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-gray-800">
      {/* <h1 className="text-7xl font-extrabold">404</h1> */}
      {/* <p className="text-xl text-gray-500 mt-2">Oops! The page you're looking for doesn't exist.</p> */}

      {/* Illustration */}
      <div className="mb-10">
        <Image
          src={notfound}
          alt="Not Found Illustration"
          className="w-full h-auto mx-auto"
        />
      </div>

      {/* Home Button */}
   
    </div>
  );
}
