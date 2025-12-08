import heroImage1 from "./../assets/image1.jpg";
import heroImage2 from "./../assets/image2.png";
import { signInWithPopup } from "firebase/auth";
import { auth, googleAuth } from "./../config/firebase";
import { useNavigate } from "react-router";
import InstallButton from "../components/InstallButton";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

const HomePage = () => {
  const navigate = useNavigate();

  const { user } = useAuth();
  useEffect(() => {
    if (user) {
      console.log("hello");
      navigate("/scan", { replace: true });
    }
  });

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleAuth);
      navigate("/scan", { replace: true });
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  return (
    <div dir="rtl" className="font-sans bg-[#f5f7f8] text-[#111418]">
      {/* Section 1 */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between gap-10 py-20 px-6 md:px-20 bg-linear-to-br from-[#f5f7f8] to-white">
        {/* Text */}
        <div className="flex-1 space-y-5">
          <h1 className="text-3xl md:text-4xl font-extrabold leading-snug text-[#111418]">
            نزلت مستعجل ولقيت حد قرر يركن عربيته لازق في عربيتك؟
          </h1>

          <h2 className="text-lg md:text-xl text-[#60758a] leading-relaxed">
            وقفت تبص للعربية اللي قافلة عليك وتتمنى يكون معاك "ونش" خاص تشيلها
            بيه؟ ولا قعدت تزعّق لحد ما صوتك راح؟
          </h2>

          <div className="mt-6">
            <p className="text-xl font-semibold text-[#007BFF] mb-4">
              الحل ببساطة 👇
            </p>
            <ul className="space-y-3 list-disc list-inside text-[#111418]/90">
              <li>
                افتح تطبيق <span className="font-semibold">"طلّعني"</span> واعمل{" "}
                <span className="font-semibold text-[#007BFF]">"سكان"</span> نمر
                العربية اللي قافلة عليك.
              </li>
              <li>
                التطبيق هيبعت إشعار أو رسالة لصاحب العربية في ساعتها يقوله:{" "}
                <span className="italic text-[#FFC107]">
                  "لو سمحت، عربيتك معطلة الدنيا!"
                </span>
              </li>
            </ul>
          </div>

          <InstallButton />
        </div>

        {/* Image */}
        <div className="flex-1 flex justify-center">
          <img
            src={heroImage1}
            alt="مشهد سيارات في القاهرة"
            className="rounded-2xl shadow-lg max-w-sm md:max-w-md object-cover border border-[#9ab3c9]/30"
          />
        </div>
      </section>

      {/* Section 2 */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-10 py-20 px-6 md:px-20 bg-linear-to-br from-[#101922] to-[#1a2634] text-[#f5f7f8]">
        {/* Text */}
        <div className="flex-1 space-y-5">
          <h1 className="text-3xl md:text-4xl font-extrabold leading-snug text-[#f5f7f8]">
            ساعات بتبقى مستعجل، فبتركنها في أي مكان وتقول "مش هتأخر". بس طبعاً
            بتتأخر، والناس بتتعطل بسببك. بدل ما ترجع تلاقي خناقة مستنياك.
          </h1>

          <h2 className="text-lg md:text-xl text-[#9ab3c9] leading-relaxed">
            وقفت تبص للعربية اللي قافلة عليك وتتمنى يكون معاك "ونش" خاص تشيلها
            بيه؟ ولا قعدت تزعّق لحد ما صوتك راح؟
          </h2>

          <div className="mt-6">
            <p className="text-xl font-semibold text-[#FFC107] mb-4">
              الحل ببساطة 👇
            </p>
            <ul className="space-y-3 list-disc list-inside text-[#f5f7f8]/90">
              <li>
                سجّل نمرتك: سجّل نمر عربيتك على{" "}
                <span className="font-semibold text-[#007BFF]">"طلّعني"</span>{" "}
                مرة واحدة بس.
              </li>
              <li>
                الناس هتوصلك: لو حد اتعطل بسببك، هيعمل "سكان" لنمرتك، وهيجيلك
                إشعار فوري.
              </li>
            </ul>
          </div>

          <button
            onClick={signInWithGoogle}
            className="mt-8 px-6 py-3 bg-[#FFC107] text-[#111418] font-semibold rounded-full shadow-md hover:bg-[#e6ad00] transition"
          >
            تجربة التطبيق
          </button>
        </div>

        {/* Image */}
        <div className="flex-1 flex justify-center">
          <img
            src={heroImage2}
            alt="سيارة مركونة غلط"
            className="rounded-2xl shadow-lg max-w-sm md:max-w-md object-cover border border-[#9ab3c9]/30"
          />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
