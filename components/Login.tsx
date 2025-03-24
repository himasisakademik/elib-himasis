import { signIn } from "@/auth";
import Footer from "./Footer";
import Header from "./Header";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Header />
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-sm w-full text-center">
          <h2 className="text-3xl font-semibold text-white mb-6">Welcome Sobat Akademik!</h2>
          <p className="text-gray-400 mb-4">
            Please Login With Your Google Account
          </p>
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/upload-materi" });
            }}
          >
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
            >
              Login
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
