import GoogleSignInButton from "../components/GoogleSigninButton";

export default function Landingpage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-r from-blue-100 to-purple-200">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Welcome to 📒NoteMark
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Your personal notes and bookmark manager
      </p>
      <GoogleSignInButton />
    </div>
  );
}
